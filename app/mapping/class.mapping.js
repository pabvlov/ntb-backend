function mapEntireClass(classes, plannings, warmups, physicalpreparations, groups ) {
    let allClasses = []
    classes.forEach(c => {
        let group = null;
        let groupAthletes = [];
        if(groups != null) {
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
            id_planification: c.id_planification,
            teacher: {
                id: c.id_user_teacher,
                assistence: Boolean(c.teacher_assistence)
            },
            planning: plannings.filter(p => p.id_planification == c.id_planification)
                .map(p => {
                    return {
                        apparatus: {
                            id: p.id_apparatus,
                            name: p.apparatus,
                            image: p.apparatus_image,
                        },
                        element: {
                            id: p.id_element,
                            name: p.element_name,
                            video: p.element_video,
                            image: p.element_image,
                            difficulty: p.difficulty
                        }
                    }
                }),
            warmups: warmups.filter(w => w.id_class == c.id).map(w => {
                return {
                    warm_up: w.warm_up,
                    quantity: w.quantity,
                    quantity_type: w.quantity !== 1 ? w.quantity_type : w.quantity_type_single
                }
            }),
            physicalpreparations: physicalpreparations.filter(p => p.id_class == c.id).map(p => {
                return {
                    physical_preparation: p.physical_preparation,
                    quantity: p.quantity,
                    quantity_type: p.quantity !== 1 ? p.quantity_type : p.quantity_type_single
                }
            }),
            group: group != null ? {
                id: group.group_id,
                name: group.group_name,
                difficulty: group.difficulty,
                athletes: groupAthletes
            } : null
        }
        allClasses.push(clase);

    });
    return allClasses;
}

module.exports = {
    mapEntireClass
}