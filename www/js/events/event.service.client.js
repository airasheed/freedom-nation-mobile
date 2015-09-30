angular.module('freedomnation.services')
    .factory('EventService', ['Podio','$q', '$http', 'utils', function (Podio,$q,$http,utils) {

        var newEvent = {},
            newEvents = [],
            eventFieldIds = {
            title: 89107336,
            date: 89107337,
            attendees: 89107415,
            price: 89107340,
            desc: 89107344,
            img: 89107348
        };

        var arrangeEvent = function(responseEvent) {

            var fields = responseEvent.fields;
            var newEvent = {};
            newEvent.id = responseEvent.item_id;

            for(var j = 0, m = fields.length; j < m; j++) {

                switch (fields[j].field_id) {

                    case eventFieldIds.title : {
                        newEvent.name =  fields[j].values[0].value;
                        break;
                    }
                    case eventFieldIds.date :
                    {
                        newEvent.date = new Date(fields[j].values[0].start_date);
                        break;
                    }
                    case eventFieldIds.attendees:{
                        var tempArray = [];
                        for(var k = 0, o = fields[j].values.length; k < o; k++) {
                            tempArray.push(fields[j].values[k].value.item_id);
                        }
                        newEvent.attendees = JSON.stringify(tempArray);
                        break;
                    }
                    case eventFieldIds.price: {
                        newEvent.price = fields[j].values[0].value;
                        break;
                    }
                    case eventFieldIds.desc : {
                        newEvent.description = fields[j].values[0].value;
                        break;
                    }
                    case eventFieldIds.img : {
                        newEvent.img = {
                            file_id: fields[j].values[0].value.file_id
                        };
                        break;
                    }
                }
            }

            return newEvent;
        };


        return {


             getEvent: function(eventId) {
                 var deferred = $q.defer();

                 Podio.podio.request('get', '/item/' + eventId)
                     .then(function (responseEvent) {
                         newEvent = arrangeEvent(responseEvent);
                         return newEvent.img.file_id;
                     })
                     .then(function(imgId) {
                         return $http.get('https://api.podio.com/file/' + imgId + '/raw', {responseType: 'arraybuffer'});
                     }).then(function(response) {
                         newEvent.img.src = utils.convertDataUrl(response);
                         deferred.resolve(newEvent);
                     })
                     .catch(function(error) {
                         console.log(error);
                     });
                 return deferred.promise;
             },

            getEvents: function () {

                var deferred = $q.defer();

                Podio.podio.request('post', '/item/app/11602319/filter')
                    .then(function (response) {

                        var responseEvents = response.items;

                        for (var i = 0, n = responseEvents.length; i < n; i++) {
                            newEvents.push(arrangeEvent(responseEvents[i]));
                        }

                        deferred.resolve(newEvents);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }
        }



    }]);