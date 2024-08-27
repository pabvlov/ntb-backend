
function bannerMapper(banners, athletes, establishments) {
    response = {
        banners: [],
        community: {
            razon_social: establishments[0].razon_social,
            acronym: establishments[0].acronym,
            logo: establishments[0].logo,
            contact: establishments[0].contact,
            instagram: establishments[0].instagram,
            facebook: establishments[0].facebook,
            description: establishments[0].description,
        },
        establishments: mapEstablishments(establishments, athletes)
    }

    alreadyExists = [];
    banners.forEach(banner => {
        response.banners.push({
            url: banner.url,
            id_establishment: banner.id_establishment,
            id_athlete: banner.id_athlete,
            athlete_name: banner.athlete_name,
            athlete_lastname: banner.athlete_lastname,
            description: banner.description,
            index: banners.indexOf(banner)+1
        });
    });

    return response;
}

function mapEstablishments(establishments, athletes) {
    response = []
    alreadyExists = [];
    establishments.forEach(establishment => {
        establishment = {
            id: establishment.id_establishment,
            name: establishment.establishment_name,
            address: establishment.address,
            capacity: establishment.capacity,
            athletes: athletes.filter(athlete => athlete.id_establishment === establishment.id_establishment)
        }
        if (!alreadyExists.includes(establishment.id)) {
            alreadyExists.push(establishment.id);
            response.push(establishment);
        }
    });
    return response;
}

module.exports = {
    bannerMapper
}