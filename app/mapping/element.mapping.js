function mapElementComposed(e, c, a) {
    apparatuses = []
    e.forEach(element => {
        if (!apparatuses.find(apparatus => apparatus.id === element.id_apparatus)) {
            apparatuses.push({
                id: element.id_apparatus,
                name: element.apparatus,
                image: element.apparatus_image,
                gender: element.apparatus_gender == "M" ? "Masculino" : "Femenino",
                elements: [
                    {
                        id: element.id,
                        name: element.name,
                        image: element.image,
                        video: element.video,
                        difficulty: element.difficulty,
                        connections: c.filter((ec) => ec.id_element === element.id).map(ec => {
                            return {
                                id: ec.id_element_connection,
                                name: element.name + ' a ' + ec.element_connection_name,
                                image: ec.element_connection_image,
                                difficulty: ec.difficulty
                            }
                        })
                    }
                ]
            });
        } else {
            apparatuses.find(apparatus => apparatus.id === element.id_apparatus).elements.push({
                id: element.id,
                name: element.name,
                image: element.image,
                video: element.video,
                difficulty: element.difficulty,
                connections: c.filter((ec) => ec.id_element === element.id).map(ec => {
                    return {
                        id: ec.id_element_connection,
                        name: element.name + ' a ' + ec.element_connection_name,
                        image: ec.element_connection_image,
                        difficulty: ec.difficulty
                    }
                })
            });
        }
    });

    return apparatuses;
}


module.exports = {
    mapElementComposed
}