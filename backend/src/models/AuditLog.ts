import mongoose, { Schema, Document, Model } from 'mongoose';

export type EntityType = 'medicine' | 'batch' | 'sale' | 'purchase' | 'prescription' | 'user' | 'supplier';
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';

export interface IAuditLog extends Document {
  entity: EntityType;
  entityId: mongoose.Types.ObjectId;
  action: ActionType;
  before?: any;
  after?: any;
  by: mongoose.Types.ObjectId;
  at: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    entity: {
      type: String,
      enum: ['medicine', 'batch', 'sale', 'purchase', 'prescription', 'user', 'supplier'],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE'],
      required: true,
    },
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    at: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes
AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ at: -1 });
AuditLogSchema.index({ by: 1 });

export const AuditLog: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
