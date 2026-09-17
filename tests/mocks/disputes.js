export const dispute = {
  id: 1,
  orderId: 42,
  sellerId: 9008,
  raisedBy: 'buyer',
  reason: 'wrong_item_sent',
  description: 'The brake light arrived cracked and does not work when connected.',
  status: 'open',
  createdAt: '2026-09-16T09:36:06.000Z',
  updatedAt: '2026-09-16T09:36:06.000Z',
  resolvedAt: null,
  closedAt: null,
}

export const disputePagination = { page: 1, limit: 10, total: 1, totalPages: 1 }

export const disputeDetail = {
  dispute,
  evidence: {
    buyer: {
      summary: dispute.description,
      attachments: [{
        id: 1,
        filename: 'buyer-evidence.png',
        uploadedAt: '2026-09-16T09:36:06.000Z',
        url: 'https://autoparts.zubitechnologies.com/api/v1/dispute-evidence/buyer-evidence.png',
      }],
    },
    seller: { summary: null, attachments: [] },
  },
  sla: { deadlineAt: '2026-09-17T09:36:06.000Z', remainingMinutes: 125, breached: false },
  timeline: [{ id: 1, event: 'opened', timestamp: '2026-09-16T09:36:06.000Z', actor: { id: 9106, type: 'user' }, detail: { raisedBy: 'buyer' } }],
  ruling: null,
}

export const respondedDisputeDetail = {
  ...disputeDetail,
  dispute: { ...dispute, updatedAt: '2026-09-16T13:22:30.000Z' },
  evidence: {
    ...disputeDetail.evidence,
    seller: {
      summary: 'The brake light was tested before dispatch and the packaging was secure.',
      attachments: [{
        id: 2,
        filename: 'seller-evidence.png',
        uploadedAt: '2026-09-16T13:22:30.000Z',
        url: '/api/v1/dispute-evidence/seller-evidence.png',
      }],
    },
  },
  timeline: [...disputeDetail.timeline, {
    id: 2,
    event: 'seller_responded',
    timestamp: '2026-09-16T13:22:30.000Z',
    actor: { id: 9109, type: 'user' },
    detail: { message: 'The brake light was tested before dispatch and the packaging was secure.', requestEventId: null, attachmentIds: [2] },
  }],
}
