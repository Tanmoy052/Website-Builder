export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  userId: string;
  messages: any[];
  modelUsed: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  prompt: string;
  generatedCode: any;
  createdAt: Date;
}

export interface File {
  id: string;
  userId: string;
  filename: string;
  storagePath: string;
  createdAt: Date;
}

export interface OTP {
  userId: string;
  otpHash: string;
  expiresAt: Date;
  used: boolean;
}

// In-memory mock database for production-grade logic demonstration
class MockDB {
  users: User[] = [];
  chats: Chat[] = [];
  projects: Project[] = [];
  files: File[] = [];
  otps: OTP[] = [];

  async findUserByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  async createUser(user: User) {
    this.users.push(user);
    return user;
  }

  async updateUserVerification(email: string, isVerified: boolean) {
    const user = this.users.find((u) => u.email === email);
    if (user) user.isVerified = isVerified;
  }

  async saveOTP(otp: OTP) {
    this.otps = this.otps.filter((o) => o.userId !== otp.userId);
    this.otps.push(otp);
  }

  async getOTP(userId: string) {
    return this.otps.find((o) => o.userId === userId);
  }

  async markOTPUsed(userId: string) {
    const otp = this.otps.find((o) => o.userId === userId);
    if (otp) otp.used = true;
  }

  // Persistent History Methods
  async saveChat(chat: Chat) {
    this.chats.push(chat);
    return chat;
  }

  async saveProject(project: Project) {
    this.projects.push(project);
    return project;
  }

  async getUserHistory(userId: string) {
    return {
      chats: this.chats
        .filter((c) => c.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      projects: this.projects
        .filter((p) => p.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      files: this.files
        .filter((f) => f.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    };
  }
}

export const db = new MockDB();
