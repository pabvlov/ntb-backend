
function communityMapper(establishments) {
    const communities = [];
    const allEstablishments = [];
    establishments.forEach(response => {
        if (!allEstablishments.find(establishment => establishment.id === response.id)) {
            allEstablishments.push({
                    id: response.id_establishment,
                    name: response.establishment_name,
                    address: response.address,
                    id_community: response.id_community,
            });
        }
    });
    
    establishments.forEach(response => {

            if (!communities.find(community => community.id === response.id_community)) {
                const community = {
                    id: response.id_community,
                    razon_social: response.razon_social,
                    acronym: response.acronym,
                    logo: response.logo,
                    contact: response.contact,
                    instagram: response.instagram,
                    facebook: response.facebook,
                    establishments: allEstablishments.filter(establishment => establishment.id_community === response.id_community)
                }
                communities.push(community);
            }
    });
    
    return communities;

};

function mapUserAthletes(athletes, roles) {
    let groupedByEstablishment = [];

    athletes.forEach(athlete => {
        // Buscar si ya existe el establecimiento en el array
        let establishment = groupedByEstablishment.find(e => e.id_establishment === athlete.establishment_id);

        if (!establishment) {
            // Si no existe, creamos una nueva entrada para el establecimiento
            establishment = {
                id_establishment: athlete.establishment_id,
                user: []
            };
            groupedByEstablishment.push(establishment);
        }

        // Ahora trabajamos dentro de este establecimiento
        let user = establishment.user.find(user => user.id === athlete.client_id);
        
        if (!user) {
            // Si no existe el usuario en este establecimiento, lo creamos
            user = {
                id: athlete.client_id,
                mail: athlete.client_mail,
                name: athlete.client_name,
                lastname: athlete.client_lastname,
                birthdate: athlete.client_birthdate,
                contact: athlete.client_contact,
                athletes: [],
                roles: roles.filter(role => role.mail_user === athlete.client_mail).map(role => {
                    return {
                        id: role.id_role,
                        role: role.role,
                        id_establishment: role.id_establishment
                    }
                })
            };
            establishment.user.push(user);
        }

        // Añadimos el atleta solo si está activo
        if (athlete.active == 1) {
            user.athletes.push({
                id: athlete.athlete_id,
                name: athlete.athlete_name,
                lastname: athlete.athlete_lastname,
                birthdate: athlete.athlete_birthdate,
                image: athlete.athlete_image,
                work_line: athlete.work_line,
                active: athlete.active
            });
        }
    });

    return groupedByEstablishment;
}



module.exports = {
    communityMapper,
    mapUserAthletes
}