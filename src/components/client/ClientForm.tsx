// ClientForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Customer, City, CustomerFormData } from '@/types/type';
import { CityService } from '@/services/cityService';

interface ClientFormProps {
  initialData?: Customer | null;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

const COUNTRY_CODES = [
  { code: '+229', country: 'Bénin' },
  { code: '+93', country: 'Afghanistan' },
  { code: '+355', country: 'Albanie' },
  { code: '+213', country: 'Algérie' },
  { code: '+1', country: 'Amérique' }, // Inclut USA et Canada
  { code: '+376', country: 'Andorre' },
  { code: '+244', country: 'Angola' },
  { code: '+1', country: 'Anguilla' },
  { code: '+672', country: 'Antarctique' },
  { code: '+1', country: 'Antigua-et-Barbuda' },
  { code: '+54', country: 'Argentine' },
  { code: '+374', country: 'Arménie' },
  { code: '+297', country: 'Aruba' },
  { code: '+247', country: 'Ascension' },
  { code: '+61', country: 'Australie' },
  { code: '+43', country: 'Autriche' },
  { code: '+994', country: 'Azerbaïdjan' },
  { code: '+1', country: 'Bahamas' },
  { code: '+973', country: 'Bahreïn' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+1', country: 'Barbade' },
  { code: '+375', country: 'Bélarus' },
  { code: '+32', country: 'Belgique' },
  { code: '+501', country: 'Belize' },
 
  { code: '+1', country: 'Bermudes' },
  { code: '+975', country: 'Bhoutan' },
  { code: '+591', country: 'Bolivie' },
  { code: '+387', country: 'Bosnie-Herzégovine' },
  { code: '+267', country: 'Botswana' },
  { code: '+55', country: 'Brésil' },
  { code: '+673', country: 'Brunéi' },
  { code: '+359', country: 'Bulgarie' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+257', country: 'Burundi' },
  { code: '+855', country: 'Cambodge' },
  { code: '+237', country: 'Cameroun' },
  { code: '+1', country: 'Canada' },
  { code: '+238', country: 'Cap-Vert' },
  { code: '+1', country: 'Îles Caïmans' },
  { code: '+236', country: 'République Centrafricaine' },
  { code: '+235', country: 'Tchad' },
  { code: '+56', country: 'Chili' },
  { code: '+86', country: 'Chine' },
  { code: '+61', country: 'Territoire Chinois de Macao' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+57', country: 'Colombie' },
  { code: '+269', country: 'Comores' },
  { code: '+242', country: 'Congo' },
  { code: '+243', country: 'République Démocratique du Congo' },
  { code: '+682', country: 'Îles Cook' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+385', country: 'Croatie' },
  { code: '+53', country: 'Cuba' },
  { code: '+599', country: 'Curaçao' },
  { code: '+357', country: 'Chypre' },
  { code: '+420', country: 'République Tchèque' },
  { code: '+45', country: 'Danemark' },
  { code: '+253', country: 'Djibouti' },
  { code: '+1', country: 'Dominique' },
  { code: '+593', country: 'Équateur' },
  { code: '+20', country: 'Égypte' },
  { code: '+503', country: 'El Salvador' },
  { code: '+240', country: 'Guinée Équatoriale' },
  { code: '+291', country: 'Érythrée' },
  { code: '+372', country: 'Estonie' },
  { code: '+251', country: 'Éthiopie' },
  { code: '+500', country: 'Falkland (Malvinas)' },
  { code: '+298', country: 'Îles Féroé' },
  { code: '+679', country: 'Fidji' },
  { code: '+358', country: 'Finlande' },
  { code: '+33', country: 'France' },
  { code: '+594', country: 'Guyane Française' },
  { code: '+689', country: 'Polynésie Française' },
  { code: '+241', country: 'Gabon' },
  { code: '+220', country: 'Gambie' },
  { code: '+7', country: 'Géorgie' },
  { code: '+49', country: 'Allemagne' },
  { code: '+233', country: 'Ghana' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+30', country: 'Grèce' },
  { code: '+299', country: 'Groenland' },
  { code: '+1', country: 'Grenade' },
  { code: '+590', country: 'Guadeloupe' },
  { code: '+1', country: 'Guam' },
  { code: '+502', country: 'Guatemala' },
  { code: '+224', country: 'Guinée' },
  { code: '+245', country: 'Guinée-Bissau' },
  { code: '+592', country: 'Guyana' },
  { code: '+509', country: 'Haïti' },
  { code: '+504', country: 'Honduras' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36', country: 'Hongrie' },
  { code: '+91', country: 'Inde' },
  { code: '+62', country: 'Indonésie' },
  { code: '+98', country: 'Iran' },
  { code: '+964', country: 'Irak' },
  { code: '+353', country: 'Irlande' },
  { code: '+44', country: 'Islande' },
  { code: '+972', country: 'Israël' },
  { code: '+39', country: 'Italie' },
  { code: '+1', country: 'Jamaïque' },
  { code: '+81', country: 'Japon' },
  { code: '+962', country: 'Jordanie' },
  { code: '+7', country: 'Kazakhstan' },
  { code: '+254', country: 'Kenya' },
  { code: '+686', country: 'Kiribati' },
  { code: '+965', country: 'Koweït' },
  { code: '+996', country: 'Kirghizistan' },
  { code: '+856', country: 'Laos' },
  { code: '+371', country: 'Lettonie' },
  { code: '+961', country: 'Liban' },
  { code: '+266', country: 'Lesotho' },
  { code: '+231', country: 'Libéria' },
  { code: '+218', country: 'Libye' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+370', country: 'Lituanie' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+853', country: 'Macao' },
  { code: '+389', country: 'Macédoine' },
  { code: '+261', country: 'Madagascar' },
  { code: '+265', country: 'Malawi' },
  { code: '+60', country: 'Malaisie' },
  { code: '+960', country: 'Maldives' },
  { code: '+223', country: 'Mali' },
  { code: '+356', country: 'Malte' },
  { code: '+692', country: 'Îles Marshall' },
  { code: '+596', country: 'Martinique' },
  { code: '+222', country: 'Mauritanie' },
  { code: '+230', country: 'Maurice' },
  { code: '+262', country: 'Mayotte' },
  { code: '+52', country: 'Mexique' },
  { code: '+691', country: 'Micronésie' },
  { code: '+373', country: 'Moldavie' },
  { code: '+377', country: 'Monaco' },
  { code: '+976', country: 'Mongolie' },
  { code: '+382', country: 'Monténégro' },
  { code: '+1', country: 'Montserrat' },
  { code: '+212', country: 'Maroc' },
  { code: '+258', country: 'Mozambique' },
  { code: '+95', country: 'Myanmar' },
  { code: '+264', country: 'Namibie' },
  { code: '+674', country: 'Nauru' },
  { code: '+977', country: 'Népal' },
  { code: '+31', country: 'Pays-Bas' },
  { code: '+599', country: 'Antilles Néerlandaises' },
  { code: '+687', country: 'Nouvelle-Calédonie' },
  { code: '+64', country: 'Nouvelle-Zélande' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+227', country: 'Niger' },
  { code: '+234', country: 'Nigeria' },
  { code: '+683', country: 'Niue' },
  { code: '+672', country: 'Terres Australes et Antarctiques Françaises' },
  { code: '+850', country: 'Corée du Nord' },
  { code: '+1', country: 'Îles Vierges Américaines' },
  { code: '+47', country: 'Norvège' },
  { code: '+968', country: 'Oman' },
  { code: '+92', country: 'Pakistan' },
  { code: '+680', country: 'Palaos' },
  { code: '+507', country: 'Panama' },
  { code: '+675', country: 'Papouasie-Nouvelle-Guinée' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Pérou' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Pologne' },
  { code: '+351', country: 'Portugal' },
  { code: '+1', country: 'Puerto Rico' },
  { code: '+974', country: 'Qatar' },
  { code: '+262', country: 'Réunion' },
  { code: '+40', country: 'Roumanie' },
  { code: '+7', country: 'Russie' },
  { code: '+250', country: 'Rwanda' },
  { code: '+685', country: 'Samoa' },
  { code: '+378', country: 'Saint-Marin' },
  { code: '+966', country: 'Arabie Saoudite' },
  { code: '+221', country: 'Sénégal' },
  { code: '+381', country: 'Serbie' },
  { code: '+248', country: 'Seychelles' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+65', country: 'Singapour' },
  { code: '+421', country: 'Slovaquie' },
  { code: '+386', country: 'Slovénie' },
  { code: '+677', country: 'Îles Salomon' },
  { code: '+252', country: 'Somalie' },
  { code: '+27', country: 'Afrique du Sud' },
  { code: '+82', country: 'Corée du Sud' },
  { code: '+34', country: 'Espagne' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+249', country: 'Soudan' },
  { code: '+597', country: 'Suriname' },
  { code: '+268', country: 'Swaziland' },
  { code: '+46', country: 'Suède' },
  { code: '+41', country: 'Suisse' },
  { code: '+963', country: 'Syrie' },
  { code: '+886', country: 'Taïwan' },
  { code: '+992', country: 'Tadjikistan' },
  { code: '+255', country: 'Tanzanie' },
  { code: '+66', country: 'Thaïlande' },
  { code: '+228', country: 'Togo' },
  { code: '+670', country: 'Timor-Leste' },
  { code: '+216', country: 'Tunisie' },
  { code: '+90', country: 'Turquie' },
  { code: '+993', country: 'Turkménistan' },
  { code: '+1', country: 'Îles Turques-et-Caïques' },
  { code: '+688', country: 'Tuvalu' },
  { code: '+256', country: 'Ouganda' },
  { code: '+380', country: 'Ukraine' },
  { code: '+971', country: 'Émirats Arabes Unis' },
  { code: '+44', country: 'Royaume-Uni' },
  { code: '+1', country: 'Îles Vierges Britanniques' },
  { code: '+598', country: 'Uruguay' },
  { code: '+998', country: 'Ouzbékistan' },
  { code: '+678', country: 'Vanuatu' },
  { code: '+379', country: 'Cité du Vatican' },
  { code: '+58', country: 'Venezuela' },
  { code: '+84', country: 'Viêt Nam' },
  { code: '+681', country: 'Wallis-et-Futuna' },
  { code: '+212', country: 'Sahara Occidental' },
  { code: '+967', country: 'Yémen' },
  { code: '+260', country: 'Zambie' },
  { code: '+263', country: 'Zimbabwe' }
].sort((a, b) => a.country.localeCompare(b.country));

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CustomerFormData>({
    type: 'entreprise',
    entreprise_name: '',
    fullname: '',
    email: '',
    phone: '',
    city_id: '',
    indication: '+229'
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getAll();
        setCities(response.results);
      } catch (error) {
        console.error('Erreur lors du chargement des villes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        entreprise_name: initialData.entreprise_name || '',
        fullname: initialData.fullname,
        email: initialData.email,
        phone: initialData.phone,
        city_id: initialData.city.id,
        indication: initialData.indication
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-neutral-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {initialData ? 'Modifier le Client' : 'Nouveau Client'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full md:col-span-1">
          <label className="block mb-2 ">Type de Client</label>
          <select
            name="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'personal' | 'entreprise' }))}
            className="w-full rounded-md  dark:bg-neutral-800 "
          >
            <option value="entreprise">Entreprise</option>
            <option value="personal">Particulier</option>
          </select>
        </div>

        {formData.type === 'entreprise' && (
          <div className="col-span-full md:col-span-1">
            <Input
              type="text"
              name="entreprise_name"
              label="Nom de l'Entreprise"
              value={formData.entreprise_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, entreprise_name: e.target.value }))}
              required
            />
          </div>
        )}

        <Input
          type="text"
          name="fullname"
          label="Nom Complet"
          value={formData.fullname}
          onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
          required
        />

        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />

        <div>
          <label className="block mb-2">Ville</label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={(e) => setFormData(prev => ({ ...prev, city_id: e.target.value }))}
            className="w-full  dark:bg-neutral-800  rounded-md"
            required
          >
            <option value="">Sélectionnez une ville</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.commune.name} - {city.commune.country.name})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Indicatif</label>
            <select
              name="indication"
              value={formData.indication}
              onChange={(e) => setFormData(prev => ({ ...prev, indication: e.target.value }))}
              className="w-full  dark:bg-neutral-800  rounded-md"
              required
            >
              {COUNTRY_CODES.map(({ code, country }) => (
                <option key={code} value={code}>
                  {code} ({country})
                </option>
              ))}
            </select>
          </div>

          <Input
            type="tel"
            name="phone"
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          {initialData ? 'Mettre à jour' : 'Créer le Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;