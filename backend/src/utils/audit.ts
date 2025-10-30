import { AuditLog, EntityType, ActionType } from '../models/AuditLog';
import mongoose from 'mongoose';

export const createAuditLog = async (
  entity: EntityType,
  entityId: string | mongoose.Types.ObjectId,
  action: ActionType,
  userId: string | mongoose.Types.ObjectId,
  before?: any,
  after?: any
): Promise<void> => {
  try {
    await AuditLog.create({
      entity,
      entityId: new mongoose.Types.ObjectId(entityId as string),
      action,
      before,
      after,
      by: new mongoose.Types.ObjectId(userId as string),
      at: new Date(),
    });
  } catch (error) {
    // Log error tapi jangan throw agar tidak mengganggu flow utama
    console.error('Failed to create audit log:', error);
  }
};
