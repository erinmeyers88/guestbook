import idb from 'idb';

class IdbApi {

    static openDatabase() {
        // If the browser doesn't support service worker,
        // we don't care about having a database
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }
        return idb.open('guestbook', 1, function (upgradeDb) {
            var store = upgradeDb.createObjectStore('guests', {
                keyPath: 'tempKey'
            });
            store.createIndex('by-date', 'time');
        });
    }

    static getGuests() {
        return this.openDatabase().then(function (db) {
            // if we're already showing posts, eg shift-refresh
            // or the very first load, there's no point fetching
            // posts from IDB
            if (!db) return;

            var index = db.transaction('guests')
                .objectStore('guests').index('by-date');

            return index.getAll();
        });
    }

    static saveGuests(people) {

        this.openDatabase().then(function (db) {

            if (!db) return;

            var tx = db.transaction('guests', 'readwrite');
            var store = tx.objectStore('guests');
            people.forEach(function (person) {
                person.tempKey = person.key;
                store.put(person);
            });

            // limit store to 30 items
            store.index('by-date').openCursor(null, "prev").then(function (cursor) {
                if (!cursor) return;
                return cursor.advance(3);
            }).then(function deleteRest(cursor) {
                if (!cursor) return;
                cursor.delete();
                return cursor.continue().then(deleteRest);
            });

        });
    }

    static saveGuest(person) {

        person.tempKey = Math.random().toString();

        this.openDatabase().then(function (db) {

            if (!db) return;

            var index = db.transaction('guests')
                .objectStore('guests').index('by-date');

            return index.getAll().then(function (people) {
                people.forEach(function (savedPerson) {
                    if (person !== savedPerson) {
                        var tx = db.transaction('guests', 'readwrite');
                        var store = tx.objectStore('guests');
                        console.log('ADD idb: ', person);
                        store.put(person);
                        store.index('by-date').openCursor(null, "prev").then(function (cursor) {
                            if (!cursor) return;
                            return cursor.advance(3);
                        }).then(function deleteRest(cursor) {
                            if (!cursor) return;
                            cursor.delete();
                            return cursor.continue().then(deleteRest);
                        });
                    }
                });
            });
        });
    }


    static deleteGuest(person) {
        this.openDatabase().then(function (db) {

            if (!db) return;

            var tx = db.transaction('guests', 'readwrite');
            var store = tx.objectStore('guests');
            console.log('DEL idb: ', person);
            return store.delete(person);

        });
    }


}

export default IdbApi;

