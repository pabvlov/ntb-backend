
function mapElementComposed(elements, connections) {
    elements.map((element) => {
        element.connections = connections.filter((elementConnection) => elementConnection.id_element === element.id).map(elementConnection => {
            return {
            id: elementConnection.id_element_connection,
            name: elementConnection.name + ' a ' + elementConnection.element_connection_name,
            image: elementConnection.element_connection_image,
            difficulty: elementConnection.difficulty
            }
        });
    });
    return elements;
}


module.exports = {
    mapElementComposed
}