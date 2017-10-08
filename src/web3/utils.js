import * as Rx from "rxjs";

export const observableFromEvent = (contractEvent) => {
    return Rx.Observable.create(observer => {
        contractEvent.watch((error, response) => {
            if (!error) {
                observer.next(response)
            } else {
                observer.error(error)
            }
            contractEvent.stopWatching()
            observer.completed()
        })
    })
}

/**
 * Must go after a contract call returning a transaction object.
 * @param eventLog The log to check has been fired
 * @returns {function(*)} Observable transformer for use in Rx.Observable.let()
 */
export const skipNextAndErrorOnMissingLog = (eventLog) => {
    return (observer) => observer
        .flatMap(tx => Rx.Observable.of(tx)
            .merge(errorOnMissingLog(eventLog, tx)))
        .filter(tx => isEventLogInTransaction(eventLog, tx))
}

const errorOnMissingLog = (eventLog, tx) => {
    return Rx.Observable.of(tx)
        .map(tx => isEventLogInTransaction(eventLog, tx))
        .filter(eventLogInTransaction => !eventLogInTransaction)
        .flatMap(anything => Rx.Observable.throw(`The transaction failed, event ${eventLog} was not made.`))
}

const isEventLogInTransaction = (event, tx) => {
    return tx.logs
        .filter(log => log.event === event)
        .length > 0
}
