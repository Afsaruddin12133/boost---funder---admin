export const mockVerifications = [
  {
    id: 'req_1',
    name: 'Rabiul Islam',
    email: 'rabiul@hopp.com',
    role: 'founder',
    status: 'approved',
    date: '2023-10-25T10:00:00Z',
    verified: true,
    reviewedBy: 'Admin Sarah',
    reviewedAt: '2023-10-26T14:30:00Z',
    documents: {
      nidFront: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      nidBack: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      businessCertificate: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=700&fit=crop'
    }
  },
  {
    id: 'req_2',
    name: 'Elena Levis',
    email: 'elena@solaris.com',
    role: 'founder',
    status: 'pending',
    date: '2023-10-28T09:15:00Z',
    verified: false,
    documents: {
      nidFront: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      nidBack: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      businessCertificate: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=700&fit=crop'
    }
  },
  {
    id: 'req_3',
    name: 'James Miller',
    email: 'james.m@investor.co',
    role: 'investor',
    status: 'rejected',
    date: '2023-10-29T11:45:00Z',
    verified: false,
    rejectionReason: 'NID image is blurry and illegible. Please re-upload a clear copy.',
    reviewedBy: 'Admin Mark',
    reviewedAt: '2023-10-30T09:00:00Z',
    documents: {
      nidFront: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      nidBack: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      incomeStatement: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=700&fit=crop'
    }
  },
  {
    id: 'req_4',
    name: 'Sarah Drane',
    email: 'sarah@flowstate.ai',
    role: 'founder',
    status: 'pending',
    date: '2023-11-01T08:20:00Z',
    verified: false,
    documents: {
      nidFront: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      nidBack: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&h=300&fit=crop',
      businessCertificate: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&h=700&fit=crop'
    }
  }
];
