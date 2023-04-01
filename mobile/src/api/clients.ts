import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { Client } from "../models/Client";

export async function getClients(): Promise<AxiosResponse<Client[]>> {
  return api.get("/clients");
}

export async function getClient(id: string): Promise<AxiosResponse<Client>> {
  return api.get(`/clients/${id}`);
}

export async function createClient(client: Client) {
  return api.post("/clients", client);
}

export async function updateClient(id: string, client: Client) {
  return api.put(`/clients/${id}`, client);
}

export async function deleteClient(id: string) {
  return api.delete(`/clients/${id}`);
}

export async function getClientContactTypes() {
  return api.get("/clients/contact-types");
}
