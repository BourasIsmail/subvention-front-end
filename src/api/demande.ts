import { Demandes } from "@/data/demande";
import { api } from ".";

export async function getFileById(id: number) {
  try {
    const response = await api.get(`/demande/download/${id}`, {
      responseType: 'blob',
    });
  } catch (error) { }
}

export async function getDemandeByCode(code: string) {
  try {
    const response = await api.get(`/demande/code/${code}`);
    return response.data as Demandes;
  } catch (error) { }
}

export async function getDemandeById(id: number) {
  try {
    const response = await api.get(`/demande/${id}`);
    return response.data as Demandes;
  } catch (error) { }
}

export async function getDemandeByCoordinationId(id: number) {
  try {
    const response = await api.get(`/demande/byCoordination/${id}`);
    return response.data as Demandes[];
  } catch (error) { }
}

export async function getDemandeByDeleguationId(id: number) {
  try {
    const response = await api.get(`/demande/byDeleguation/${id}`);
    return response.data as Demandes[];
  } catch (error) { }
}

export async function getAllDemandes() {
  try {
    const response = await api.get(`/demande`);
    return response.data as Demandes[];
  } catch (error) { }
}

export async function getAllCoordination() {
  try {
    const response = await api.get(`/coordination`);
    return response.data as Coordination[];
  } catch (error) { }
}

export async function getAllDeleguation() {
  try {
    const response = await api.get(`/deleguation`);
    return response.data as Deleguation[];
  } catch (error) { }
}

export async function getDeleguationByCoordinationId(id: number | undefined) {
  try {
    const response = await api.get(`/deleguation/byIdCoord/${id}`);
    return response.data as Deleguation[];
  } catch (error) { }
}

export async function getDashboard(
  deleguationId?: string,
  coordinationId?: string
) {
  try {
    const response = await api.get(
      `/demande/dashboard?delegiationId=${deleguationId || ""}&coordinationId=${coordinationId || ""
      }`
    );
    return response.data as UserData;
  } catch (error) { }
}

interface UserData {
  totalDemandes: number;
  demandesEnCours: number;
  demandesAcceptees: number;
  demandesRefusees: number;
  demandesUrbaines: number;
  demandesRurales: number;
  agentsHommes: number;
  agentsFemmes: number;
  beneficiairesHommes: number;
  beneficiairesFemmes: number;
  totalAgents: number;
  totalBeneficiaires: number;
  beneficiaireServiceMatinal: number;
  beneficiaireServicePartiel: number;
  beneficiaireServiceTotal: number;
  beneficiaireTousService: number;
  beneficaireHommeRural: number;
  beneficaireFemmeRural: number;
  beneficaireHommeUrbain: number;
  beneficaireFemmeUrbain: number;
}

export interface Coordination {
  id: number;
  nom: string;
}

export interface Deleguation {
  id: number;
  nom: string;
  coordination: Coordination;
}

export interface Demande {
  id: number;
  nomAssociation: string;
  deleguation: Deleguation;
  coordination: Coordination;
  numAutorisation: string;
  addresse: string;
  telephonePresident: string; // Updated field name
  emailPresident: string;
  nomPresident: string;
  nbrBeneficiairesHommes: number;
  nbrBeneficiairesFemmes: number;
  nbrAgentsHommes: number;
  nbrAgentsFemmes: number;
  sujetDemande: string;
  nomEtablissement: string; // Added field
  nomDirecteur: string;
  telDirecteur: string; // Added field
  emailDirecteur: string; // Added field
  dateDemande: string; // Updated field type to match Java entity
  nbrTotalBeneficiaires: number;
  nbrTotalAgents: number;
  codeDemande: string; // Updated field type to match Java entity
  rib: string | null;
  capaciteChargeTotal: string | null; // Updated field type to match Java entity
  nbrBeneficiairesServiceTotal: number;
  nbrBeneficiairesServiceMatinal: number;
  nbrBeneficiairesServicePartiel: number;
  dateCollecte: string | null;
  dureeValidite: number;
  revenuTotalAnneePrecedente: number;
  recetteTotalAnneePrecedente: number;
  etat: string;
  typeMilieu: string | null;
  zipData: File | null;
  fileName: string | null;
  fileType: string | null;
}
