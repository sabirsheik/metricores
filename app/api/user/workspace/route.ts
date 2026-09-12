import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { calculatorsData } from '@/data/calculators';
import type { CalculationRecord, CalculatorId } from '@/types';

const MAX_HISTORY = 50;
const MAX_SAVED = 50;

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

    const body = await request.json();
    const calculatorId = body.calculatorId as CalculatorId;
    const calculator = calculatorsData[calculatorId];
    if (!calculator) return NextResponse.json({ error: 'Unknown calculator' }, { status: 400 });

    if (body.action === 'history') {
      const record: CalculationRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        calculatorId,
        calculatorName: calculator.name,
        category: calculator.category,
        inputs: body.inputs || {},
        results: body.results || [],
        name: typeof body.name === 'string' && body.name.trim() ? body.name.trim() : undefined,
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