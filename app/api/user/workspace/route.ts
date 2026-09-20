import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { calculatorsData } from '@/data/calculators';
import { createRateLimiter, getClientIdentifier, sanitizeText } from '@/lib/security';
import type { CalculationRecord, CalculatorId } from '@/types';

const workspaceLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 });

const MAX_HISTORY = 50;
const MAX_SAVED = 50;
const MAX_REQUEST_BYTES = 100_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isResultList(value: unknown): value is CalculationRecord['results'] {
  return Array.isArray(value) && value.length <= 50 && value.every((result) => isRecord(result));
}

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  await dbConnect();
  return User.findById(session.user.id);
}

function serialize(user: any) {
  return {
    history: user.history || [],
    saved: user.savedCalculations || [],
    favorites: user.favoriteCalculators || [],
    recentlyUsed: user.recentlyUsed || [],
  };
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ workspace: serialize(user) });
  } catch (error) {
    console.error('[Workspace GET Error]', error);
    return NextResponse.json({ error: 'Unable to load workspace' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clientIp = getClientIdentifier({ headers: request.headers });
    if (!workspaceLimiter(clientIp, 'workspace')) {
      return NextResponse.json({ error: 'Too many workspace updates. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    if (!isRecord(body) || JSON.stringify(body).length > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'Invalid workspace payload' }, { status: 400 });
    }

    const calculatorId = body.calculatorId as CalculatorId;
    if (typeof calculatorId !== 'string' || !Object.prototype.hasOwnProperty.call(calculatorsData, calculatorId)) {
      return NextResponse.json({ error: 'Unknown calculator' }, { status: 400 });
    }
    const calculator = calculatorsData[calculatorId];

    if (body.inputs !== undefined && !isRecord(body.inputs)) {
      return NextResponse.json({ error: 'Invalid calculator inputs' }, { status: 400 });
    }

    if (body.results !== undefined && !isResultList(body.results)) {
      return NextResponse.json({ error: 'Invalid calculator results' }, { status: 400 });
    }

    if (body.action === 'history') {
      const record: CalculationRecord = {
        id: randomUUID(),
        calculatorId,
        calculatorName: calculator.name,
        category: calculator.category,
        inputs: body.inputs || {},
        results: body.results || [],
        createdAt: new Date().toISOString(),
      };
      user.history = [record, ...(user.history || [])].slice(0, MAX_HISTORY) as any;
      user.recentlyUsed = [calculatorId, ...(user.recentlyUsed || []).filter((id: string) => id !== calculatorId)].slice(0, 8);
    } else if (body.action === 'recent') {
      user.recentlyUsed = [calculatorId, ...(user.recentlyUsed || []).filter((id: string) => id !== calculatorId)].slice(0, 8);
    } else if (body.action === 'favorite') {
      const favorites = new Set(user.favoriteCalculators || []);
      body.enabled ? favorites.add(calculatorId) : favorites.delete(calculatorId);
      user.favoriteCalculators = Array.from(favorites) as any;
    } else if (body.action === 'save') {
      const record: CalculationRecord = {
        id: randomUUID(),
        calculatorId,
        calculatorName: calculator.name,
        category: calculator.category,
        inputs: body.inputs || {},
        results: body.results || [],
        name: typeof body.name === 'string' ? sanitizeText(body.name, 120) || undefined : undefined,
        createdAt: new Date().toISOString(),
      };
      user.savedCalculations = [record, ...(user.savedCalculations || [])].slice(0, MAX_SAVED) as any;
    } else {
      return NextResponse.json({ error: 'Unknown workspace action' }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ workspace: serialize(user) });
  } catch (error) {
    console.error('[Workspace POST Error]', error);
    return NextResponse.json({ error: 'Unable to update workspace' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const clientIp = getClientIdentifier({ headers: request.headers });
    if (!workspaceLimiter(clientIp, 'workspace-delete')) {
      return NextResponse.json({ error: 'Too many workspace updates. Please try again later.' }, { status: 429 });
    }

    const { type, id } = await request.json();
    if (type === 'clear-history') user.history = [];
    else if (type === 'history') user.history = (user.history || []).filter((item: any) => item.id !== id) as any;
    else if (type === 'saved') user.savedCalculations = (user.savedCalculations || []).filter((item: any) => item.id !== id) as any;
    else return NextResponse.json({ error: 'Unknown delete action' }, { status: 400 });
    await user.save();
    return NextResponse.json({ workspace: serialize(user) });
  } catch (error) {
    console.error('[Workspace DELETE Error]', error);
    return NextResponse.json({ error: 'Unable to delete workspace item' }, { status: 500 });
  }
}