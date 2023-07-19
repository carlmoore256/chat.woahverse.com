import { isAuthenticated } from "../stores/isAuthenticated";
import APIClient from "../services/api";


export async function initializeAuthentication() {
    const authStatus = await APIClient.isAuthenticated();
    isAuthenticated.set(authStatus);
}