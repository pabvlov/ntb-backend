
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
            id: banner.id_content,
            url: banner.url,
            id_establishment: banner.id_establishment,
            id_user: banner.id_user,
            user_name: banner.user_name,
            user_lastname: banner.user_lastname,
            user_mail: banner.user_mail,
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