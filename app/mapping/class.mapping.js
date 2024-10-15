function mapEntireClass(classes, elements, warmups, physicalpreparations, groups, presences) {
    let allClasses = []
    
    classes.forEach(c => {
        let group = null;
        let groupAthletes = [];
        let asistenciasMap = {};
        
        if (groups != null) {
            group = groups.filter(g => g.group_id == c.id_group)[0];
            groupAthletes = groups.filter(g => g.group_id == c.id_group).map(g => {
                return {
                    athlete_id: g.athlete_id,
                    athlete: g.athlete,
                    athlete_image: g.athlete_image
                }
            });
        }
        clase = {
            id: c.id,
            id_establishment: c.id_establishment,
            start_date: c.start_date,
            end_date: c.end_date,
            teacher: {
                id: c.id_user_teacher,
                name: c.teacher_name,
                lastname: c.teacher_lastname,
                assistence: Boolean(c.teacher_assistence)
            },
            planning: c.id_planification == null ? null : {
                id: c.id_planification,
                apparatuses: (() => {
                    const uniqueApparatusIds = new Set();
                    return elements.filter(p => p.id_planification == c.id_planification)
                        .filter(p => {
                            if (uniqueApparatusIds.has(p.id_apparatus)) {
                                return false;
                            } else {
                                uniqueApparatusIds.add(p.id_apparatus);
                                return true;
                            }
                        })
                        .map(p => {
                            return {
                                id: p.id_apparatus,
                                name: p.apparatus,
                                image: p.apparatus_image,
                                elements: elements.filter(e => e.id_apparatus == p.id_apparatus && e.id_planification == c.id_planification)
                                    .map(e => {
                                        return {
                                            id: e.id_element,
                                            name: e.element_name,
                                            video: e.element_video,
                                            image: e.element_image,
                                            difficulty: e.difficulty
                                        }
                                    })
                            }
                        });
                })(),
                warm_ups: warmups.filter(w => w.id_planification == c.id_planification).map(w => {
                    return {
                        warm_up: w.warm_up,
                        quantity: w.quantity,
                        quantity_type: w.quantity !== 1 ? w.quantity_type : w.quantity_type_single
                    }
                }),
                physical_preparations: physicalpreparations.filter(pp => pp.id_planification == c.id_planification).map(pp => {
                    return {
                        physical_preparation: pp.physical_preparation,
                        quantity: pp.quantity,
                        quantity_type: pp.quantity !== 1 ? pp.quantity_type : pp.quantity_type_single
                    }
                })
            },
            group: group != null ? {
                id: group.group_id,
                name: group.group_name,
                difficulty: group.difficulty,
                athletes: groupAthletes
            } : null
        }

        // Proceso de asistencias utilizando un map
        if (presences != null) {
            presences
                .filter(p => p.id_class == c.id) // Filtramos por la clase actual
                .forEach(p => {
                    if (!asistenciasMap[p.date]) {
                        asistenciasMap[p.date] = {
                            date: p.date,
                            athletes: []
                        };
                    }
                    asistenciasMap[p.date].athletes.push({
                        id_athlete: p.id_athlete,
                        athlete: groupAthletes.filter(a => a.athlete_id == p.id_athlete)[0].athlete
                    });
                });
        }

        // Convertimos el map a un array
        const asistencias = Object.values(asistenciasMap);
        clase.presences = asistencias;

        allClasses.push(clase);

    });
    return allClasses;
}

module.exports = {
    mapEntireClass
}