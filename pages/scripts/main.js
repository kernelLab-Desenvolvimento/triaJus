import { auth } from '../page-Entrada/scripts/01-auth.js';
import { service } from '../page-Entrada/scripts/02-service.js';
import { infoReq } from '../page-Entrada/scripts/03-infoReq.js';

// Inicialização da aplicação
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const path = window.location.pathname;
    if (path.includes("01-auth")) auth();
    if (path.includes("02-service")) service();
    if (path.includes("03-infoReq")) infoReq();
  } catch (e) {
    console.error("Erro na inicialização:", e);
    showError("Erro ao carregar a aplicação. Recarregue a página.");
  }
});