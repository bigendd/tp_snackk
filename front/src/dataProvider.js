import { fetchUtils } from 'react-admin';

const API_URL = 'http://localhost:8080/api';

// httpClient personnalisé
const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json'
        });
    }

    const token = localStorage.getItem('token');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    console.log('HTTP Client - URL:', url);
    console.log('HTTP Client - Options:', options);

    return fetchUtils.fetchJson(url, options);
};

// Fonction utilitaire pour transformer les relations id en IRI
const convertRelationsToIRI = (data) => {
    const newData = { ...data };

    Object.keys(newData).forEach(key => {
        const value = newData[key];

        // On ignore la clé id elle-même
        if (key === 'id') return;

        // Cas d'une relation simple : id (number or string)
        if ((typeof value === 'number' || typeof value === 'string')) {
            // Par convention, on considère que la clé correspond au nom de la ressource en singulier
            // Tu peux modifier cette logique si besoin (ex : map spécifique)
            const resourceName = key.endsWith('s') ? key : `${key}s`;

            // Exemple: 'category' -> 'categories' -> '/api/categories/5'
            newData[key] = `/api/${resourceName}/${value}`;
        }
        // Cas d'une relation multiple (tableau d'ids)
        else if (Array.isArray(value)) {
            const resourceName = key.endsWith('s') ? key : `${key}s`;
            newData[key] = value.map(id => `/api/${resourceName}/${id}`);
        }
    });

    return newData;
};

const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        
        const query = {
            [`order[${field || 'id'}]`]: order || 'DESC',
            page: page,
            itemsPerPage: perPage,
        };

        if (params.filter) {
            Object.keys(params.filter).forEach(key => {
                query[key] = params.filter[key];
            });
        }

        const url = `${API_URL}/${resource}?${new URLSearchParams(query)}`;
        
        return httpClient(url).then(({ json }) => {
            console.log('getList response:', json);
            
            if (!json.member || !Array.isArray(json.member)) {
                console.error('Invalid API response structure:', json);
                throw new Error('Invalid API response structure');
            }

            return {
                data: json.member.map(item => ({
                    id: item.id,
                    ...item
                })),
                total: json.totalItems || 0,
            };
        });
    },

    getOne: (resource, params) => {
        const url = `${API_URL}/${resource}/${params.id}`;
        return httpClient(url).then(({ json }) => {
            console.log('getOne response:', json);
            return {
                data: {
                    id: json.id,
                    ...json
                }
            };
        });
    },

    getMany: (resource, params) => {
        const query = params.ids.map(id => `id[]=${id}`).join('&');
        const url = `${API_URL}/${resource}?${query}`;
        return httpClient(url).then(({ json }) => ({
            data: json.member ? json.member.map(item => ({ id: item.id, ...item })) : []
        }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        
        const query = {
            [`order[${field || 'id'}]`]: order || 'DESC',
            page: page,
            itemsPerPage: perPage,
            [params.target]: params.id,
        };

        if (params.filter) {
            Object.keys(params.filter).forEach(key => {
                query[key] = params.filter[key];
            });
        }

        const url = `${API_URL}/${resource}?${new URLSearchParams(query)}`;
        
        return httpClient(url).then(({ json }) => ({
            data: json.member ? json.member.map(item => ({ id: item.id, ...item })) : [],
            total: json.totalItems || 0,
        }));
    },

    create: (resource, params) => {
        const url = `${API_URL}/${resource}`;
        const dataToSend = convertRelationsToIRI(params.data);

        return httpClient(url, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        }).then(({ json }) => ({
            data: { id: json.id, ...json }
        }));
    },

    update: (resource, params) => {
        const url = `${API_URL}/${resource}/${params.id}`;
        const dataToSend = convertRelationsToIRI(params.data);

        return httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(dataToSend),
        }).then(({ json }) => ({
            data: { id: json.id, ...json }
        }));
    },

    updateMany: (resource, params) => {
        return Promise.all(
            params.ids.map(id =>
                httpClient(`${API_URL}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        ).then(responses => ({
            data: responses.map(({ json }) => json.id),
        }));
    },

    delete: (resource, params) => {
        const url = `${API_URL}/${resource}/${params.id}`;
        return httpClient(url, {
            method: 'DELETE',
        }).then(({ json }) => ({
            data: { id: params.id, ...json }
        }));
    },

    deleteMany: (resource, params) => {
        return Promise.all(
            params.ids.map(id =>
                httpClient(`${API_URL}/${resource}/${id}`, {
                    method: 'DELETE',
                })
            )
        ).then(() => ({
            data: params.ids,
        }));
    },
};

export default dataProvider;
