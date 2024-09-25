
function mapElementComposed(e, c) {

    elements = []
    e.forEach(element => {
        elements.push({
            id: element.id,
            name: element.name,
            video: element.video,
            image: element.image,
            difficulty: element.difficulty,
            apparatus: {
                id: element.id_apparatus,
                name: element.apparatus,
                image: element.apparatus_image,
                gender: element.apparatus_gender == "M" ? "Masculino" : "Femenino"
            },
            connections: c.filter((ec) => ec.id_element === element.id).map(ec => {
                return {
                id: ec.id_element_connection,
                name: element.name + ' a ' + ec.element_connection_name,
                image: ec.element_connection_image,
                difficulty: ec.difficulty
                }
            })
        });
    });

    elements.map((element) => {
        
    });
    return elements;
}


module.exports = {
    mapElementComposed
}