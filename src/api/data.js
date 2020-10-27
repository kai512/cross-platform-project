import appAjax from '_libs/app-ajax'

export const getChartsData = () => {

    return appAjax.postJson({
        service : "/get_charts_data"
    })
}
