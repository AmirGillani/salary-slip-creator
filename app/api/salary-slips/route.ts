import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SalarySlip from '@/models/SalarySlip';

export async function GET() {
  await dbConnect();
  try {
    const slips = await SalarySlip.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: slips });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const slip = await SalarySlip.create(body);
    return NextResponse.json({ success: true, data: slip }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const deletedSlip = await SalarySlip.findByIdAndDelete(id);

    if (!deletedSlip) {
      return NextResponse.json({ success: false, error: "Slip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

