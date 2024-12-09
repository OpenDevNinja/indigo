// Mock data for Panels Page
export interface PanelData {
  id: string;
  type: string;
  panelType: string;
  pays: string;
  commune: string;
  location: string;
  status: string;
  gpsCoordinates: string;
  surface: number;
  faces: number;
  lastCampaign: string;
  sens: string;
}
export const panelsData=  [
  {
    id: 'P001',
    type: 'Statique',
    panelType: '12m2',
    pays: 'Guinée',
    commune: 'Ratoma',
    location: 'Commune de Ratoma',
    status: 'Disponible',
    gpsCoordinates: '9.5370° N, 13.7130° W',
    surface: 12,
    faces: 2,
    lastCampaign: 'Orange Mobile - Jan 2024',
    sens: 'Nord-Sud'
  },
  {
    id: 'P002',
    type: 'Dynamique',
    panelType: 'BigSize',
    pays: 'Guinée',
    commune: 'Matoto',
    location: 'Commune de Matoto',
    status: 'Indisponible',
    gpsCoordinates: '9.5371° N, 13.7131° W',
    surface: 24,
    faces: 3,
    lastCampaign: 'MTN - Fev 2024',
    sens: 'Sud-Nord'
  },
  {
    id: 'P003',
    type: 'Statique',
    panelType: 'PetitsPanneaux',
    pays: 'Guinée',
    commune: 'Dixinn',
    location: 'Commune de Dixinn',
    status: 'Disponible',
    gpsCoordinates: '9.5372° N, 13.7132° W',
    surface: 6,
    faces: 1,
    lastCampaign: 'Sotelgui - Mar 2024',
    sens: 'Est-Ouest'
  }
];
  
  // Mock data for Campaigns Page
  export interface Campaign {
    id: string;
    clientName: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    status: 'Normal' | 'Annulé' | 'En cours' | 'À venir' | 'Terminé';
    panelsUsed: number;
    totalReach?: number;
    panelGroups?: PanelData[]; 
    pays?: string;
    commune?: string;
  }
  
  export interface Client {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    totalCampaigns: number;
    activeContracts: number;
  }
  export interface CampaignFormData {
    clientName: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    panelGroups: PanelData[];
    status: string;
  }
  
  export const campaignsData: Campaign[] = [
    {
      id: 'C001',
      clientName: 'Orange Mobile',
      campaignName: 'Campagne Nationale 2024',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'Normal',
      panelsUsed: 15,
      pays: 'Guinée',
      commune: 'Conakry'
    },
    {
      id: 'C002',
      clientName: 'MTN Guinée',
      campaignName: 'Promotion Internet Mobile',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'Annulé',
      panelsUsed: 10,
      pays: 'Bénin',
      commune: 'Calavi'
    }
  ];
  
  export const clientsData: Client[] = [
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