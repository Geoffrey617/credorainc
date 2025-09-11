import { db } from '@/lib/db'
import { User, Landlord } from '@prisma/client'

export interface CreateUserData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface CreateLandlordData {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export class UserService {
  // User operations
  static async createUser(data: CreateUserData): Promise<User> {
    return await db.user.create({
      data: {
        ...data,
        name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
      },
    })
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { email },
    })
  }

  static async getUserById(id: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { id },
    })
  }

  static async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    return await db.user.update({
      where: { id },
      data: {
        ...data,
        name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
        updatedAt: new Date(),
      },
    })
  }

  static async verifyUserEmail(id: string): Promise<User> {
    return await db.user.update({
      where: { id },
      data: {
        emailVerified: true,
        updatedAt: new Date(),
      },
    })
  }

  static async updateUserSignIn(id: string): Promise<User> {
    return await db.user.update({
      where: { id },
      data: {
        signedInAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  // Landlord operations
  static async createLandlord(data: CreateLandlordData): Promise<Landlord> {
    return await db.landlord.create({
      data: {
        ...data,
        name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
      },
    })
  }

  static async getLandlordByEmail(email: string): Promise<Landlord | null> {
    return await db.landlord.findUnique({
      where: { email },
    })
  }

  static async getLandlordById(id: string): Promise<Landlord | null> {
    return await db.landlord.findUnique({
      where: { id },
    })
  }

  static async updateLandlord(id: string, data: Partial<CreateLandlordData>): Promise<Landlord> {
    return await db.landlord.update({
      where: { id },
      data: {
        ...data,
        name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
        updatedAt: new Date(),
      },
    })
  }

  static async verifyLandlordEmail(id: string): Promise<Landlord> {
    return await db.landlord.update({
      where: { id },
      data: {
        emailVerified: true,
        updatedAt: new Date(),
      },
    })
  }

  static async verifyLandlordId(id: string): Promise<Landlord> {
    return await db.landlord.update({
      where: { id },
      data: {
        idVerified: true,
        updatedAt: new Date(),
      },
    })
  }

  static async updateLandlordSubscription(
    id: string, 
    plan: string, 
    status: string
  ): Promise<Landlord> {
    return await db.landlord.update({
      where: { id },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: status,
        updatedAt: new Date(),
      },
    })
  }

  static async updateLandlordSignIn(id: string): Promise<Landlord> {
    return await db.landlord.update({
      where: { id },
      data: {
        signedInAt: new Date(),
        updatedAt: new Date(),
      },
    })
  }

  // Utility functions
  static async findOrCreateUser(email: string, userData: Partial<CreateUserData>): Promise<User> {
    const existingUser = await this.getUserByEmail(email)
    
    if (existingUser) {
      return existingUser
    }

    return await this.createUser({
      email,
      ...userData,
    })
  }

  static async findOrCreateLandlord(email: string, landlordData: Partial<CreateLandlordData>): Promise<Landlord> {
    const existingLandlord = await this.getLandlordByEmail(email)
    
    if (existingLandlord) {
      return existingLandlord
    }

    return await this.createLandlord({
      email,
      ...landlordData,
    })
  }
}
