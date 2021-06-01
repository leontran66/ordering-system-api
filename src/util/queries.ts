export const createProfile = 'INSERT INTO profile (user_id, abn, name, phone, fax, address, suburb, state, postcode) VALUES(${user}, ${abn}, ${name}, ${phone}, ${fax}, ${address}, ${suburb}, ${state}, ${postCode})';

export const getOwnProfile = 'SELECT * FROM profile WHERE user_id = $1';

export const getProfile = 'SELECT * FROM profile';

export const updateProfile = 'UPDATE profile SET abn = ${abn}, name = ${name}, phone = ${phone}, fax = ${fax}, address = ${address}, suburb = ${suburb}, state = ${state}, postcode = ${postCode} WHERE user_id = ${user}';
