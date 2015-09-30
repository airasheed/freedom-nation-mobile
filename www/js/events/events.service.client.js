angular.module('starter.services')
    .factory('EventsService', function (Podio,$q,$http) {

        var newEvents = [];
        var eventFieldIds = {
            title: 89107336,
            date: 89107337,
            attendees: 89107415,
            price: 89107340,
            desc: 89107344,
            img: 89107348
        };


        return {

            getEvents: function () {

                var deferred = $q.defer();

                Podio.podio.request('post', '/item/app/11602319/filter')
                    .then(function (response) {
                        var responseEvents = response.items;

                        for (var i = 0, n = responseEvents.length; i < n; i++) {
                            var fields = responseEvents[i].fields;

                            var event = {};
                            event.id = responseEvents[i].item_id;

                            for (var j = 0, m = fields.length; j < m; j++) {

                                switch (fields[j].field_id) {

                                    case eventFieldIds.title :
                                    {
                                        event.name = fields[j].values[0].value;
                                        break;
                                    }

                                    case eventFieldIds.date :
                                    {
                                        event.date = fields[j].values[0].start_date;
                                        break;
                                    }
                                    case eventFieldIds.attendees:
                                    {
                                        event.attendees = fields[j].values;
                                        break;
                                    }
                                    case eventFieldIds.price:
                                    {
                                        event.price = fields[j].values[0].value;
                                        break;
                                    }
                                    case eventFieldIds.desc :
                                    {
                                        event.description = fields[j].values[0].value;
                                        break;
                                    }
                                    case eventFieldIds.img :
                                    {
                                        event.img = fields[j].values[0].value;
                                        break;
                                    }
                                }
                            }
                            newEvents.push(event);
                        }

                        deferred.resolve(newEvents);

                    })
                    .catch(function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }
        }
    });
