import axios from 'axios';
import config from '../config';
import Role from '../types/role';

export default async (user: string):Promise<boolean> => {
  const data = {
    audience: `https://${config.secrets.AUTH0_DOMAIN}/api/v2/`,
    client_id: config.secrets.AUTH0_MGMT_CLIENT_ID,
    client_secret: config.secrets.AUTH0_MGMT_CLIENT_SECRET,
    grant_type: 'client_credentials',
  };

  const token = await axios.post(`https://${config.secrets.AUTH0_DOMAIN}/oauth/token`, data, { headers: { 'content-type': 'application/json' } });
  const isAdmin = await axios.get(`https://${config.secrets.AUTH0_DOMAIN}/api/v2/users/${user}/roles`, { headers: { authorization: `Bearer ${token.data.access_token}` } })
    .then((roles) => {
      if (roles.data.find((role: Role) => role.name === 'admin')) {
        return true;
      }
      return false;
    })
    .catch(() => false);
  return isAdmin;
};
