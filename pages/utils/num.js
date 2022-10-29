

const numFormat = (n, minFD, maxFD) => {

    return n.toLocaleString("en", {minimumFractionDigits: minFD || 0, maximumFractionDigits: maxFD || 0})
}

export default numFormat