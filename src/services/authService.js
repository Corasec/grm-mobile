import config from '../../config';
import request from '../utils/request';

const baseURL = config.API_AUTH_BASE_URL || '';
export { baseURL };

function handleErrors(response)
{
  if (response.non_field_errors) {
    setTimeout(() => alert(response.non_field_errors[0]), 1000);
    throw Error(response.non_field_errors[0]);
  }
  return response;
}

export async function fetchAuthCredentials(data) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(`${baseURL}/authentication/login/`, requestOptions)
      const result = handleErrors(response)      
      return await result.json();
    } catch (error) {
      return { error: 'Failed to fetch authentication credentials' };
    }
}
  
/**
 * Profile of the logged-in mobile account: account type (committee / facilitator),
 * whether it can process issues, committee info and the locations it can report.
 * Accounts that are neither committee nor facilitator get a 403.
 */
export async function fetchMobileProfile() {
  const url = `/authentication/profile/`;
  const requestOptions = {
    url,
    method: 'GET',
  };
  try {
    const response = await request({
      ...requestOptions,
    });
    const jsonData = response.data;
    return jsonData;
  } catch (error) {
    console.error(JSON.stringify(error.message));
    // Show the server explanation when there is one (e.g. account not allowed on the mobile app)
    const serverMessage = error?.response?.data?.error;
    return { error: serverMessage ? new Error(serverMessage) : error };
  }
}

// DRF tokens do not expire: no check / refresh endpoint on the server.
export async function logout() {
  // Besides removing session from storage. Implement it, if a logout endpoint is available.
}

