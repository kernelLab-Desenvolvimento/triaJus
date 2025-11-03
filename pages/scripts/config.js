/*configurações globais */
export const API_BASE_URL = 'http://localhost:3001/api';

/*funções para data e hora */
export function dataAtual() {
  const data = new Date();
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

export function horaAtual() {
  const agora = new Date();
  return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

/*Caixa de erro personalizada */
export function showError(message) {
  const errorElement = document.getElementById('error-message') || createErrorMessageElement();
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => errorElement.style.display = 'none', 5000);
}

function createErrorMessageElement() {
  const div = document.createElement('div');
  div.id = 'error-message';
  div.style = `position: fixed;
              top: 20px;
              right: 20px;
              padding: 15px;
              background: #ff4444;
              color: white;
              border-radius: 5px;
              display: none;
              z-index: 1000;`;
  document.body.appendChild(div);
  return div;
}

export async function fetchAPI(endpoint, method, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data) || undefined
  };
  try {
    console.log("Chamada",`${API_BASE_URL}/${endpoint}`, options);
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na chamada API:', error);
    throw error;
  }
}
