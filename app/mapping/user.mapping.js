
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



module.exports = {
    communityMapper
}