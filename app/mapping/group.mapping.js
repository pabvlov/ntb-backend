
function mapAthletesIntoGroups(groups, athletes) {
  const groupedByEstablishment = [];

  groups.forEach(group => {
      // Buscar si ya existe el establecimiento en el array
      let establishment = groupedByEstablishment.find(e => e.id_establishment === group.establishment_id);

      if (!establishment) {
          // Si no existe, creamos una nueva entrada para el establecimiento
          establishment = {
              id_establishment: group.establishment_id,
              groups: []
          };
          groupedByEstablishment.push(establishment);
      }

      // Crear un objeto de grupo con los atletas filtrados
      const groupWithAthletes = {
          id: group.id,
          name: group.name,
          difficulty: group.difficulty_category,
          athletes: athletes.filter(athlete => athlete.group_id === group.id).map(athlete => {
              return {
                  id: athlete.athlete_id,
                  name: athlete.athlete,
                  image: athlete.athlete_image
              };
          })
      };

      // Añadimos el grupo al establecimiento correspondiente
      establishment.groups.push(groupWithAthletes);
  });

  return groupedByEstablishment;
}



module.exports = {
    mapAthletesIntoGroups
}