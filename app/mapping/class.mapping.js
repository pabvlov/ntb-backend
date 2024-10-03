function mapEntireClass(classes, elements, warmups, physicalpreparations, groups) {
    let allClasses = []

    classes.forEach(c => {
        let group = null;
        let groupAthletes = [];
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
                elements: elements.filter(p => p.id_planification == c.id_planification)
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
        allClasses.push(clase);

    });
    return allClasses;
}

module.exports = {
    mapEntireClass
}