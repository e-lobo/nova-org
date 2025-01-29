export type KYCSubmission = {
  id: string
  name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  processedAt?: string
  documentUrl: string
}

export const mockSubmissions: KYCSubmission[] = Array.from({ length: 50 }, (_, i) => ({
  id: `KYC-${(i + 1).toString().padStart(5, '0')}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as KYCSubmission['status'],
  submittedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  processedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
  documentUrl: `https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop`
}))

export const getStats = () => {
  const pendingCount = mockSubmissions.filter(s => s.status === 'pending').length
  const todaySubmissions = mockSubmissions.filter(s => 
    new Date(s.submittedAt).toDateString() === new Date().toDateString()
  ).length
  const approvedCount = mockSubmissions.filter(s => s.status === 'approved').length
  const totalProcessed = mockSubmissions.filter(s => s.status !== 'pending').length

  const avgProcessingTime = mockSubmissions
    .filter(s => s.processedAt)
    .reduce((acc, curr) => {
      const processTime = new Date(curr.processedAt!).getTime() - new Date(curr.submittedAt).getTime()
      return acc + processTime
    }, 0) / totalProcessed

  return {
    pendingReviews: pendingCount,
    todaySubmissions,
    weeklyApprovalRate: (approvedCount / totalProcessed * 100).toFixed(1),
    avgProcessingTime: Math.floor(avgProcessingTime / (1000 * 60 * 60)) // in hours
  }
}

export const getChartData = () => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  return {
    submissions: last7Days.map(date => ({
      date,
      count: mockSubmissions.filter(s => s.submittedAt.startsWith(date)).length
    })),
    status: [
      { status: 'Pending', value: mockSubmissions.filter(s => s.status === 'pending').length },
      { status: 'Approved', value: mockSubmissions.filter(s => s.status === 'approved').length },
      { status: 'Rejected', value: mockSubmissions.filter(s => s.status === 'rejected').length }
    ]
  }
}