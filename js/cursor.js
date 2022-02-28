import {gsap} from 'gsap'
import {getMousePos, lerp, getSiblings} from './utils'

// Grab mouse Position
let mouse = {x: 0, y: 0}
window.addEventListener('mousemove', (e) => (mouse = getMousePos(e)))
export default class cursor {
    constructor(el) {
        //    Variables
        this.Cursor = el
        this.Cursor.style.opacity = 0
        this.Item = document.querySelectorAll(".hero-inner-link-item")
        this.Hero = document.querySelectorAll('.hero-inner')
        this.bounds = this.Cursor.getBoundingClientRect()
        this.cursorConfigs = {
            x: {previous: 0, current: 0, amt: 0.2}, y: {previous: 0, current: 0, amt: 0.2}
        }
        //    defining mouse move function
        this.onMouseMoveEv = () => {
            this.cursorConfigs.x.previous = this.cursorConfigs.x.current = mouse.x;
            this.cursorConfigs.y.previous = this.cursorConfigs.y.current = mouse.y;
            //    set cursor opacity to 1 when hovered
            gsap.to(this.Cursor, {
                duration: 1, ease: "Power3.easeOut", opacity: 1
            })
            //execute scale move
            this.onScaleMouse()


            requestAnimationFrame(() => this.render())

            window.removeEventListener("mousemove", this.onMouseMoveEv)


        }
        window.addEventListener("mousemove", this.onMouseMoveEv)
    }

    //scale media on mouse
    onScaleMouse() {
        this.Item.forEach((link) => {
            if (link.matches(":hover")) {
                this.setVideo(link)
                this.scaleAnimation(this.Cursor.children[0], 0.8)

            }
            link.addEventListener('mouseenter', () => {
                this.setVideo(link)
                this.scaleAnimation(this.Cursor.children[0], 0.8)
            })
            link.addEventListener('mouseleave', () => {
                this.scaleAnimation(this.Cursor.children[0], 0)
            })
            //    hover on a tag
            link.children[1].addEventListener('mouseenter', () => {
                this.Cursor.classList.add("media-blend")
                this.scaleAnimation(this.Cursor.children[0], 1.2)
            })
            link.children[1].addEventListener('mouseleave', () => {
                this.Cursor.classList.remove("media-blend")
                this.scaleAnimation(this.Cursor.children[0], 0.8)
            })
        })
    }

    //scale animation
    scaleAnimation(el, amt) {
        gsap.to(el, {
            duration: 0.6, scale: amt, ease: "Power3.easeOut"
        })
    }

    // set video
    setVideo(el) {
        let src = el.getAttribute("data-video-src")
        let video = document.querySelector(`#${src}`)
        let siblings = getSiblings(video);
        if(video.id == src){
            gsap.set(video,{zIndex:4,opacity:1})
            siblings.forEach((i)=>{
                gsap.set(i,{zIndex:1,opacity:0})
            })
        }
    }

    render() {
        this.cursorConfigs.x.current = mouse.x
        this.cursorConfigs.y.current = mouse.y

        //    lerp
        for (const key in this.cursorConfigs) {
            this.cursorConfigs[key].previous = lerp(this.cursorConfigs[key].previous, this.cursorConfigs[key].current, this.cursorConfigs[key].amt)
        }
        //Setting the cursor x and y to cursor html element
        this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) 
        translateY(${this.cursorConfigs.y.previous}px)`;

        requestAnimationFrame(() => this.render())
    }
}