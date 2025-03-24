// types.ts



export interface Panel {
  id: string;
  type_pannel: PanelType;
  group_pannel: PanelGroup;
  surface: string;
  city: City;
  description: string | null;
  created_at: string;
  updated_at: string;
  country: Country;
  quantity: number;
  face_number: number;
  sense: string;
  code: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
  token_exp: string;
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone: string | null;
    phone_indi: string | null;
  }
}



// Type pour la création/mise à jour d'un panneau (ce qui est envoyé à l'API)
export interface PanelApiPayload {
  type_pannel_id: string;
  group_pannel_id: string;
  surface: string;
  city_id: string;
  country_id: string;
  commune_id: string; // Ajoutez cette ligne
  quantity: number;
  face_number: number;
  sense: string;
  description?: string | null;
}
// Type pour le formulaire local
/* export interface PanelFormData {
  type_pannel: {
    id: string;
    type: string;
  };
  group_pannel: {
    id: string;
    name: string;
  };
  surface: string;
  city: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string;
    };
  };
  country: string;
  quantity: number;
  face_number: number;
  sense: string;
  description: string | null;
}
 */

export interface PanelFormData {
  type_pannel: {
    id: string;
    type: string;
  };
  group_pannel: {
    id: string;
    name: string;
  };
  surface: string;
  city: {
    id: string;
    name: string;
    commune: {
      id: string;
      name: string;
      country: {
        id: string;
        name: string;
      };
    };
  };
  quantity: number;
  face_number: number;
  sense: string;
  description: string | null;
}

export interface Department {
    id: string;
    name: string;
  }
  
  export interface City {
    id: string;
    name: string;
    commune: Commune;
  }
  
  
  export interface Customer {
    id: string;
    fullname: string;
    email: string;
    indication: string;
    phone: string;
    entreprise_name?: string;
    city: City;
    type: 'particulier' | 'entreprise';
    created_at: string;
    updated_at: string;
    count_campaign: number;
  }
  
  export interface CustomerFormData {
    fullname: string;
    email: string;
    indication: string;
    phone: string;
    entreprise_name?: string;
    city_id: string;
    type: 'particulier' | 'entreprise';
  }
  
  export interface PanelType {
    id: string;
    type: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface PanelGroup {
    id: string;
    name: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Country {
    id: string;
    name: string;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }

  export interface Commune {
    id: string;
    name: string;
    country: Country;
  }
 

  export interface Alert {
    id: string;
    email: string;
    indication: string;
    phone: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface AlertCreatePayload {
    email: string;
    indication: string;
    phone: string;
  }
  
  export interface AlertUpdatePayload extends Partial<AlertCreatePayload> {}
  



  export interface CampaignPanel {
    quantity: number;
    panel: {
      id: string;
      code: string;
      surface: string;
      description: string | null;
      face_number: number;
      sense: string;
    };
  }
  
  export interface Campaign {
    id: string;
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      role: string | null;
      phone: string | null;
      phone_indi: string | null;
    };
    customer: Customer;
    start_date: string;
    end_date: string;
    panel: CampaignPanel[];
    created_at: string;
    updated_at: string;
    time_remaining: string;
  }
  
  export interface CampaignCreateUpdate {
    customer_id: string; // Au lieu de customer
    start_date: string;
    end_date: string;
    panel: {
      quantity: number;
      panel: string; // ID du panneau
    }[];
  }