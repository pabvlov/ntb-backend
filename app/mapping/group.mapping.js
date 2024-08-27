
function mapAthletesIntoGroups(groups, athletes) {
    groups.map(group => {
        group.athletes = athletes.filter(athlete => athlete.group_id === group.id).map(athlete => {
          return {
            id: athlete.athlete_id,
            name: athlete.athlete,
            image: athlete.athlete_image
          }
        });
    });
    return groups;
};



module.exports = {
    mapAthletesIntoGroups
}