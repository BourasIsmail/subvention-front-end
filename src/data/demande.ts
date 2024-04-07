type Deleguation = {
  id?: number;
  nom?: string;
  coordination?: Coordination;
};
type Coordination = {
  id?: number;
  nom?: string;
};



export type Demandes = {
  id?: number;
  nomAssociation?: string;
  deleguation?: Deleguation;
  coordination?: Coordination;
  numAutorisation?: string;
  addresse?: string;
  telephonePresident?: string; // Updated field name
  emailPresident?: string;
  nomPresident?: string;
  nbrBeneficiairesHommes?: number;
  nbrBeneficiairesFemmes?: number;
  nbrAgentsHommes?: number;
  nbrAgentsFemmes?: number;
  sujetDemande?: string;
  nomEtablissement?: string; // Added field
  nomDirecteur?: string | null;
  telDirecteur?: string; // Added field
  emailDirecteur?: string; // Added field
  dateDemande?: string; // Updated field type to match Java entity
  nbrTotalBeneficiaires?: number;
  nbrTotalAgents?: number;
  codeDemande?: string; // Updated field type to match Java entity
  rib?: string;
  capaciteChargeTotal?: string | null; // Updated field type to match Java entity
  nbrBeneficiairesServiceTotal?: number;
  nbrBeneficiairesServiceMatinal?: number;
  nbrBeneficiairesServicePartiel?: number;
  dateCollecte?: string | null;
  dureeValidite?: number;
  revenuTotalAnneePrecedente?: number;
  recetteTotalAnneePrecedente?: number;
  etat?: string;
  typeMilieu?: string | null;
  zipData?: File | null;
  fileName?: string | null;
  fileType?: string | null;
};


export const data: Demandes[] = [
  {
    id: 1,
    nomAssociation: "اختبار",
    deleguation: {
      id: 1,
      nom: "اسم الوفد الخاص بك",
      coordination: {
        id: 1,
        nom: "اختبار1",
      },
    },
    coordination: {
      id: 1,
      nom: "اختبار1",
    },
    numAutorisation: "aa/11",
    addresse: "العنوان",
    telephonePresident: "رقم هاتفك", // Updated field name
    emailPresident: "president@example.com",
    nbrBeneficiairesHommes: 50000,
    nbrBeneficiairesFemmes: 100000,
    nbrAgentsHommes: 5,
    nbrAgentsFemmes: 3,
    sujetDemande: "موضوع الطلب",
    dateDemande: "13/03/2024", // Updated date format
    nbrTotalBeneficiaires: 150000,
    nbrTotalAgents: 8,
    codeDemande: "46990", // Updated to string
    rib: "11111111111",
    capaciteChargeTotal: null,
    nbrBeneficiairesServiceTotal: 0,
    nbrBeneficiairesServiceMatinal: 0,
    nbrBeneficiairesServicePartiel: 0,
    nomPresident: "اسم الرئيس",
    nomDirecteur: null,
    dateCollecte: null,
    dureeValidite: 0,
    revenuTotalAnneePrecedente: 0.0,
    recetteTotalAnneePrecedente: 0.0,
    typeMilieu: "حضري",
    etat: "قيد العمل",
    zipData: null,
    fileName: null,
    fileType: null,
  },
  // Other objects follow similar structure with their respective values...
];


