const {createElement: h, Component} = require('preact')
const classnames = require('classnames')
const {vertexEvents} = require('./helper')

const absoluteStyle = zIndex => ({
    position: 'absolute',
    zIndex
})

class Vertex extends Component {
    constructor(props) {
        super(props)

        for (let e of vertexEvents) {
            this[`handle${e}`] = evt => {
                let handler = this.props[`on${e}`] || (() => {})
                handler(evt, this.props.position)
            }
        }
    }

    render() {
        let {shift, random, sign, selected, heat,
            exclude, excludeVertex, excludeMode,
            paint, dimmed, marker, ghostStone, animate} = this.props

        let markerMarkup = z => !!marker && h('div', {
            key: 'marker',
            className: 'shudan-marker',
            title: marker.label,
            style: absoluteStyle(z)
        })

        return h('div',
            Object.assign({
                style: {
                    position: 'relative'
                },
                className: classnames(
                    'shudan-vertex',
                    `shudan-random_${random}`,
                    `shudan-sign_${sign}`,

                    {
                        [`shudan-shift_${shift}`]: !!shift,
                        [`shudan-heat_${!!heat && heat.strength}`]: !!heat,
                        [`shudan-paint_${paint}`]: !!paint,
                        'shudan-dimmed': dimmed,
                        'shudan-selected': selected,
                        'shudan-excludeVertex': excludeVertex,
                        'shudan-exclude': exclude,
                        [`shudan-heat_${!!heat && heat.strength}`]: !!heat,
                        'shudan-animate': animate
                    },

                    marker && marker.type && `shudan-marker_${marker.type}`,
                    marker && marker.type === 'label'
                        && marker.label
                        && (marker.label.includes('\n') || marker.label.length >= 3)
                        && `shudan-smalllabel`,

                    ghostStone && `shudan-ghost_${ghostStone.sign}`,
                    ghostStone && ghostStone.type && `shudan-ghost_${ghostStone.type}`,
                    ghostStone && ghostStone.faint && `shudan-ghost_faint`
                )
            }, ...vertexEvents.map(eventName => ({
                [`on${eventName}`]: this[`handle${eventName}`]
            }))),

            !sign && markerMarkup(0),
            !sign && !!ghostStone && h('div', {key: 'ghost', className: 'shudan-ghost', style: absoluteStyle(1)}),

            h('div', {key: 'stone', className: 'shudan-stone', style: absoluteStyle(2)},
                !!sign && h('div', {key: 'shadow', className: 'shudan-shadow', style: absoluteStyle()}),
                !!sign && h('div', {
                    key: 'inner',
                    className: classnames(
                        'shudan-inner',
                        'shudan-stone-image',
                        `shudan-random_${random}`,
                        `shudan-sign_${sign}`,
                    ),
                    style: absoluteStyle()
                }, sign),

                !!sign && markerMarkup()
            ),

            !!paint && h('div', {key: 'paint', className: 'shudan-paint', style: absoluteStyle(3)}),
            !!selected && h('div', {key: 'selection', className: 'shudan-selection', style: absoluteStyle(4)}),

            h('div', {key: 'heat', className: 'shudan-heat', style: absoluteStyle(5)}),
            !!heat && h('div', {
                key: 'heatlabel',
                className: 'shudan-heatlabel',
                style: absoluteStyle(6)
            }, heat.text && heat.text.toString()),

            !!excludeMode && !!exclude && exclude.bnum < 0 && h('div', {key: 'excludeB', className: 'shudan-excludeAllowB', style: absoluteStyle(7)}),
            !!excludeMode && !!exclude && exclude.wnum > 0 && h('div', {key: 'excludeW', className: 'shudan-excludeAvoidW', style: absoluteStyle(8)}),
            !!excludeMode && !!exclude && exclude.bnum > 0 && h('div', {key: 'excludeB', className: 'shudan-excludeAvoidB', style: absoluteStyle(9)}),
            !!excludeMode && !!exclude && exclude.wnum < 0 && h('div', {key: 'excludeW', className: 'shudan-excludeAllowW', style: absoluteStyle(10)}),
            !!excludeMode && !!excludeVertex && excludeMode === 'avoid' && h('div', {key: 'excludeVertex', className: 'shudan-excludeVertexAvoid', style: absoluteStyle(11)}),
            !!excludeMode && !!excludeVertex && excludeMode === 'allow' && h('div', {key: 'excludeVertex', className: 'shudan-excludeVertexAllow', style: absoluteStyle(11)})
        )
    }
}

module.exports = Vertex
