const { NjSuper } = require('njsuper')

class X1 extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
    }

    createX1Elements(x1, type) {
        // this.output(x1)
        this.ids = []
        function createX1Child (element, x1in) {
            for (let x in x1in) {
                if (!isNaN(x)) {
                    if (x1in[x].in) {
                        element.append(document.createElement(x1in[x].in.name))
                        for (let a in x1in[x].in) {
                            if (!isNaN(a)) {
                                element.children[x].setAttribute(x1in[x].in[a][0], x1in[x].in[a][1])
                            }
                        }
                        createX1Child(element.children[x], x1in[x])
                    } else {
                        element.append(document.createElement(x1in[x].name))
                        element.children[x].innerText = x1in[x].value
                        for (let a in x1in[x]) {
                            if (!isNaN(a)) {
                                element.children[x].setAttribute(x1in[x][a][0], x1in[x][a][1])
                            }
                        }
                    }

                    // console.log(element)
                }
            }
        }
        for (let x in x1) {
            if (!isNaN(x)) {
                this.elements[this.id] = document.createElement(x1[x].in.name)
                for (let a in x1[x].in) {
                    if (!isNaN(a)) {
                        this.elements[this.id].setAttribute(x1[x].in[a][0], x1[x].in[a][1])
                        this.options[this.id] = x1[x].in[a]

                    }
                }
                createX1Child(this.elements[this.id], x1[x])
                this.ids.push(this.id)
                this.id = this.id + 1
            }
        }
    }

    x1(file) {
        file = file + '\n'
        let pjms = [], line = [''], id = 0, sptag = '', continueattr = false, addattrs = ['']
        let launch = false, lid = 0, low = [], x1 = {}, x1in = {}, x1j = {}, zero = false

        const objElement = (string, value) => {
            let ctag = [], vtag = [], vr = 0, elmnt = {}
            if (addattrs.length > 1)
                for (const i in addattrs)
                    if (addattrs[i] !== '')
                        this.pin(elmnt, addattrs[i])

                addattrs = ['']

            ctag = this.splitCharsFilter(string, ' >*=', ' >*\n')
            let tagf = false
            for (var es = 0; es < ctag.length; es++) {
                if (ctag[es] !== '' && ctag[es] != undefined) {
                    if (!tagf) vtag[0] = ctag[es], vr = vr + 1
                    else if (this.isEnd('=', ctag[es]))  vtag[vr] = [this.filterChars(ctag[es], ' ='), this.filterChars(ctag[es +1], ' \n')], vr = vr + 1, es++
                    else if (value) vtag[vr] = vtag[vr] ? vtag[vr]+' '+ ctag[es] : ctag[es]
                    tagf = true
                }
            }
            if (value) {
                if (vtag.length > 0) {
                    for (var es = 1; es < vtag.length - 1; es++) {
                        this.pin(elmnt , vtag[es])
                    }
                    Object.assign(elmnt, {name: vtag[0], value: vtag[vtag.length - 1]})
                }
            } else {
                for (var es = 1; es < vtag.length ; es++) {
                    this.pin(elmnt, vtag[es])
                }
                Object.assign(elmnt, {name: vtag[0]})
            }


            return elmnt
        }

        const pinx1 = (id, pj) => {
            for (let idj in x1) {
                if (idj > pj && idj < id) {
                    this.pin(x1[id], x1[idj])
                    delete x1[idj]
                }
            }
        }

        const pinx1j = (id, pj) => {
            for (let idj in x1j) {
                if (idj > pj && idj < id) {
                    this.pin(x1[id], x1j[idj])
                    delete x1j[idj]
                } else {
                    this.pin(x1, x1j[idj], idj)
                }
            }
        }

        const pinx1in = (id, pj) => {
            for (let idn in x1in) {
                if (!x1in[idn].name) {
                    delete x1in[idn]
                } else {
                    if (idn > pj && idn < id) {
                        this.pin(x1[id], x1in[idn])
                        delete x1in[idn]
                    } else {
                        this.pin(x1, x1in[idn], idn)
                        delete x1in[idn]
                    }
                }

            }
        }


        const pin = (id, pj, up) => {
            if (up) pinx1(id, pj), pinx1j(id, pj)
            else pinx1j(id, pj), pinx1(id, pj)
        }


        for (let i in file) {
            if (file[i] !== ' ') {
                if (file[i] === '*') {
                    pjms[id] = line[lid] + ' ' + file[i],  lid = lid + 1

                    line[lid] = file[i]
                    id = id + 1
                } else if (file[i - 1] === ' ') {
                    if (launch) {
                        pjms[id] = line[lid], lid = lid + 1, line[lid] = 'opt'
                        if (pjms[id] === '\n') {
                            // pjms[id-1] = pjms[id-1]
                            id = id -1
                            lid = lid + 1
                            line[lid] = 's '
                        }
                        id = id + 1
                        launch = false
                    }
                    if (line[lid] === 'opt') {
                        if (this.isEnd(',', pjms[id - 1])) {
                            continueattr = true
                            pjms[id - 1] = pjms[id - 1] + file[i]
                            line[lid] = pjms[id - 1] + file[i]
                            id = id - 1
                            line[lid] = line[lid] + file[i]
                        } else {
                            line[lid] = pjms[id - 1] + ' > '
                            id = id - 1
                            line[lid] = line[lid] + file[i]
                        }

                    } else if (file[i]!=='\n' ) {
                        if (line[lid] === '\n' || line[lid] === '*') {
                            lid = lid + 1
                            line[lid] = line[lid] ? line[lid] + file[i] : file[i]
                        } else  {
                            line[lid] = line[lid] ? line[lid]+  " " + file[i] : file[i]
                        }

                    } else {
                        pjms[id] = line[lid],  lid = lid + 1, line[lid] = file[i]
                        id = id + 1
                    }

                } else if (file[i] === '\n') {
                   
                    if (this.isIntro('{', line[lid])) {
                        line[lid + 1] = 'before='+this.filterChars(line[lid].slice(1, line[lid].length))
                        line[lid] = 's'
                        lid = lid + 1
                    }
                    
                    if (this.isEnd('}', line[lid])) {
                        let al = line[lid].length - 1, aline = '', attr = false, complete = false, cl = line[lid]
                        line[lid] = ''
                        
                        for (;;) {
                            if (al > -1) {
                                if (!attr)
                                    if (cl[al] === '{') attr = true, al--
                                    else aline = cl[al] + aline
                                if (!complete && attr) {
                                    if (cl[al] === '>') {
                                        line[lid + 1] = '\n'
                                        line[lid + 2] = line[lid]
                                        complete = true, line[lid] = '>'
                                    } else if (al == 0) {
                                        zero = true
                                        line[lid] = cl[al] + line[lid]
                                        break
                                    } else line[lid] = cl[al] + line[lid]
                                } else if (complete) {
                                    line[lid] = cl[al] + line[lid]
                                }
                            } else break

                            al = al - 1
                        }
                        if (zero) {
                            addattrs.push(['after', aline])
                        } else {
                            line[lid -2] = line[lid -2].trim() + ' '
                            pjms[id] = line[lid], id = id + 1
                            lid = lid + 2
                            addattrs.push(['after', aline])
                        }
                       
                    }


                    if (line[lid - 1] === '*' || line[lid - 1] === '\n') {

                        if (!zero && addattrs.length > 1) pjms[id] = '#', id = id + 1
                        low = this.filterChars(line[lid], '\n').split(' ')

                        for (const l in low) {
                            if (low[l] !== '') {
                                pjms[id] = ' l ' + low[l]
                                let pj = id - 1

                                for (;;) {
                                    if (pj > -1) {
                                        if (pjms[pj].includes(low[l]+' ') && !this.isIntro('#', pjms[pj]) ) {

                                            sptag = this.splitOnce(pjms[pj], low[l]+' ', 'right', 'last')
                                            if (this.isIntro('#', pjms[id - 1])) {
                                                if (sptag[0].includes('=') && this.countChars(sptag[0], ' ') == 1)
                                                    sptag[1] = this.filterChars(sptag[1], '>') + ' ' + sptag[0] + ' >'
                                                if (sptag[0]=== '' || this.isIntro('s', sptag[0])) {

                                                    x1[id] = {}, pin(id, pj, 'up')
                                                    x1[id].in = objElement(sptag[1])
                                                } else if (x1j.hasOwnProperty(0)) {

                                                    x1[id] = {}, pin(id, pj)
                                                    x1[id].in = objElement(sptag[1])
                                                } else {

                                                    x1[id] = {}, pinx1in(id, pj), pinx1(id, pj, 'up')
                                                    x1[id].in = objElement(sptag[1])
                                                }

                                            } else {
                                                x1j[id] = {}
                                                for (let idn in x1in) {
                                                    if (idn > pj && idn < id) {
                                                        this.pin(x1j[id], x1in[idn])
                                                        delete x1in[idn]
                                                    } else {
                                                        this.pin(x1, x1in[idn], idn)
                                                        delete x1in[idn]
                                                    }
                                                }
                                                x1j[id].in = objElement(sptag[1])
                                            }
                                            pjms[pj] = sptag[0]
                                            pjms[id] = '# ' + sptag[1] + pjms[id]
                                            break;
                                        } else if (!this.isIntro('#', pjms[pj]) && pjms[pj] !== '' && !this.isIntro('s', pjms[pj])) {
                                            pjms[id] = pjms[pj] + pjms[id]
                                            this.pin(x1in, objElement(pjms[pj], 'value'), pj)
                                            pjms[pj] = ''
                                            // pjms[pj] = '#' + pjms[pj]
                                        }
                                        pj = pj - 1
                                    } else break
                                }
                                id = id + 1
                            }

                        }
                        line[lid] = file[i]

                    } else if (line[lid] === 's') {
                        if (line[lid +1]) line[lid] = file [i]+ line[lid +1]
                    } else {
                        pjms[id] = line[lid] + file[i], lid = lid + 1, line[lid] = file[i]
                        id = id + 1
                    }

                } else if (file[i - 1] === '=') {

                    launch = true; line[lid] = line[lid] + file[i]
                } else if (continueattr) {
                    line[lid] = pjms[id]
                    line[lid] = line[lid] + file[i]
                    continueattr = false, launch = true
                } else {
                    line[lid] = line[lid] ? line[lid] + file[i] : file[i]
                }
            }
        }

        // this.output(pjms)
        // console.log(x1)
        this.createX1Elements(x1)
    }
}

module.exports = { X1 }
