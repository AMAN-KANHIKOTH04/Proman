import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const projects = await prisma.project.findMany({
      include: { tasks: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, owner_id } = body;

    if (!name || !owner_id) {
      return NextResponse.json({ error: 'Name and owner_id are required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: { name, description, owner_id },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
