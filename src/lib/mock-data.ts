// Mock data for Panels Page
export const panelsData = [
    {
      id: 'P001',
      type: '12m²',
      location: 'Commune de Ratoma',
      status: 'Disponible',
      gpsCoordinates: '9.5370° N, 13.7130° W',
      surface: 12,
      faces: 'Double face',
      lastCampaign: 'Orange Mobile - Jan 2024'
    },
    {
      id: 'P002',
      type: 'Big Size',
      location: 'Commune de Matoto',
      status: 'Occupé',
      gpsCoordinates: '9.5371° N, 13.7131° W',
      surface: 24,
      faces: 'Triple face',
      lastCampaign: 'MTN - Fev 2024'
    }
  ];
  
  // Mock data for Campaigns Page
  export const campaignsData = [
    {
      id: 'C001',
      clientName: 'Orange Mobile',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'En cours',
      panelsUsed: 15,
      totalReach: 250000
    },
    {
      id: 'C002',
      clientName: 'MTN Guinée',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'À venir',
      panelsUsed: 10,
      totalReach: 180000
    }
  ];
  
  // Mock data for Clients Page
  export const clientsData = [
    {
      id: 'CL001',
      name: 'Orange Mobile',
      contactPerson: 'Marie Diallo',
      email: 'marie.diallo@orange.gn',
      phone: '+224 620 XX XX XX',
      totalCampaigns: 5,
      activeContracts: 2
    },
    {
      id: 'CL002',
      name: 'MTN Guinée',
      contactPerson: 'Amadou Bah',
      email: 'amadou.bah@mtn.gn',
      phone: '+224 622 XX XX XX',
      totalCampaigns: 3,
      activeContracts: 1
    }
  ];
  
  // Mock data for Reports Page
  export const reportsData = [
    {
      id: 'R001',
      type: 'Disponibilité des Panneaux',
      generatedDate: '2024-03-15',
      period: 'Janvier - Mars 2024',
      totalPanels: 254,
      availablePanels: 126,
      occupiedPanels: 128
    },
    {
      id: 'R002',
      type: 'Performance des Campagnes',
      generatedDate: '2024-03-20',
      period: 'Février 2024',
      totalCampaigns: 37,
      revenueGenerated: 15000000,
      averageReach: 225000
    }
  ];
  
  // Dashboard Statistics
  export const dashboardStats = {
    totalPanels: 254,
    activeCampaigns: 37,
    newClients: 18,
    reportsGenerated: 126,
    monthlyRevenue: 25000000,
    panelOccupancyRate: 50.4
  };