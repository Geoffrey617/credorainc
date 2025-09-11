import { db } from '@/lib/db'
import { Application } from '@prisma/client'

export interface CreateApplicationData {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  employmentStatus?: string
  income?: number
  creditScore?: number
  rentalAddress?: string
  rentalCity?: string
  rentalState?: string
  rentalZipCode?: string
  monthlyRent?: number
  leaseLength?: string
  moveInDate?: Date
}

export interface UpdateApplicationData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  employmentStatus?: string
  income?: number
  creditScore?: number
  rentalAddress?: string
  rentalCity?: string
  rentalState?: string
  rentalZipCode?: string
  monthlyRent?: number
  leaseLength?: string
  moveInDate?: Date
  status?: string
  paymentStatus?: string
  paymentIntentId?: string
  applicationFee?: number
}

export class ApplicationService {
  static async createApplication(data: CreateApplicationData): Promise<Application> {
    return await db.application.create({
      data,
    })
  }

  static async getApplicationById(id: string): Promise<Application | null> {
    return await db.application.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })
  }

  static async getApplicationsByUserId(userId: string): Promise<Application[]> {
    return await db.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getApplicationsByEmail(email: string): Promise<Application[]> {
    return await db.application.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
    return await db.application.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  static async submitApplication(id: string, paymentIntentId?: string): Promise<Application> {
    return await db.application.update({
      where: { id },
      data: {
        status: 'submitted',
        paymentIntentId,
        submittedAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  static async updatePaymentStatus(
    id: string, 
    paymentStatus: string, 
    paymentIntentId?: string
  ): Promise<Application> {
    return await db.application.update({
      where: { id },
      data: {
        paymentStatus,
        paymentIntentId,
        updatedAt: new Date(),
      },
    })
  }

  static async approveApplication(id: string): Promise<Application> {
    return await db.application.update({
      where: { id },
      data: {
        status: 'approved',
        updatedAt: new Date(),
      },
    })
  }

  static async rejectApplication(id: string): Promise<Application> {
    return await db.application.update({
      where: { id },
      data: {
        status: 'rejected',
        updatedAt: new Date(),
      },
    })
  }

  static async deleteApplication(id: string): Promise<void> {
    await db.application.delete({
      where: { id },
    })
  }

  // Get applications with pagination
  static async getApplicationsPaginated(
    page: number = 1,
    limit: number = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit
    
    const where = status ? { status } : {}
    
    const [applications, total] = await Promise.all([
      db.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      db.application.count({ where }),
    ])

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  // Get application statistics
  static async getApplicationStats() {
    const [total, submitted, approved, rejected, pending] = await Promise.all([
      db.application.count(),
      db.application.count({ where: { status: 'submitted' } }),
      db.application.count({ where: { status: 'approved' } }),
      db.application.count({ where: { status: 'rejected' } }),
      db.application.count({ where: { status: { in: ['draft', 'under_review'] } } }),
    ])

    return {
      total,
      submitted,
      approved,
      rejected,
      pending,
    }
  }
}
