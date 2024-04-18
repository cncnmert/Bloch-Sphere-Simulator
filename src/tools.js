import * as THREE from "../node_modules/three/build/three.module.js";

import {
    CartesianAxes, StatePointer
} from "./composite_shapes.js";

import {
    GlobalContext
} from "./context.js";

import {
    BlochSphereState
} from "./bloch_sphere_state.js";

var ToolboxEventsNamespace = {  
    thetaAngleOnInputChangeEvent: function() {
        let thetaAngle = $("#theta-angle").val();
        let angle = parseInt(thetaAngle);
    
        // update html content
        $("#theta-angle-value").html(`${angle}<span>&#176;</span>`);
    
        // save tetha angle
        GlobalContext.blochSphereStateProperties.theta = angle;

        GlobalContext.blochSphere.reset(angle, GlobalContext.blochSphereStateProperties.phi);
        GlobalContext.blochSphere.resetPtheta(angle);
    },

    phiAngleOnInputChangeEvent: function() {
        let phiAngle = $("#phi-angle").val();
        let angle = parseInt(phiAngle);
    
        // update html content
        $("#phi-angle-value").html(`${angle}<span>&#176;</span>`);
    
        // save phi angle
        GlobalContext.blochSphereStateProperties.phi = angle;

        GlobalContext.blochSphere.reset(GlobalContext.blochSphereStateProperties.theta, angle);
        GlobalContext.blochSphere.resetPphi(angle);
    },

    GateOnClickEvent: function(theta, phi) {
        GlobalContext.blochSphereStateProperties.theta = theta;
        GlobalContext.blochSphereStateProperties.phi = phi;

        GlobalContext.blochSphere.reset(theta, phi);
        GlobalContext.blochSphere.resetPtheta(theta);
        GlobalContext.blochSphere.resetPphi(phi);
    },

    RotateOnClickEvent: function (axis, angle) {
        $(":button").prop('disabled', true);

        let ax = axis == "x" ? CartesianAxes.XAxis : axis == "y" ? CartesianAxes.YAxis : CartesianAxes.ZAxis; 

        if (angle == null)
            angle = parseInt($("#" + axis + "-rot-input").val());

        let direction = angle >= 0 ? 1 : -1;

        let currentAngle = 0; // TODO: BURAYA THETA VEYA PHİ AÇISI DEĞERİ GELMELİ
        let intervalTime = 10;
        let totalTime = angle * direction * intervalTime;

        // FIXME: SEKMEYİ ALT+TAB YAPINCA İŞLEM DEVAM ETMİYOR
        let timer = setInterval(function() {
            if (currentAngle === angle * direction) return;

            GlobalContext.blochSphere.updateBlochSphereState(ax, THREE.MathUtils.degToRad(direction));
            
            // let a = 
            GlobalContext.blochSphere.resetPtheta(BlochSphereState.getInstance().z);
            // GlobalContext.blochSphere.resetPtheta(BlochSphereState.getInstance().theta);
            // GlobalContext.blochSphere.resetPphi(BlochSphereState.getInstance().phi);
            // currentAngle += direction;

        }, intervalTime);

        setTimeout(function() {
            clearInterval(timer);
            $(":button").prop('disabled', false);
        }, totalTime);
    },

    valuesOnChange: function() {

        // console.log((GlobalContext.blochSphereStateProperties.theta));

        // let thetaAngle = GlobalContext.blochSphereStateProperties.theta;
        // $("#theta-angle-value").html(`${thetaAngle}<span>&#176;</span>`);
        // $("#theta-angle").val(thetaAngle);

        // let phiAngle = GlobalContext.blochSphereStateProperties.phi;
        // $("#phi-angle-value").html(`${phiAngle}<span>&#176;</span>`);
        // $("#phi-angle").val(phiAngle);
   
        this.updateBlochSphereStateExpressions();

        // console.log(GlobalContext.blochSphereStateProperties.theta);
    },

    updateBlochSphereStateExpressions: function () {
        const state = BlochSphereState.getInstance();

        //Updates added
        $("#bloch-sphere-state-theta").text(state.theta);
        $("#bloch-sphere-state-phi").text(state.phi);

        $("#bloch-sphere-state-alpha").text(state.alpha);
        $("#bloch-sphere-state-beta").text(state.beta);

        $("#bloch-sphere-state-0").text(state.prob0);
        $("#bloch-sphere-state-1").text(state.prob1);

        $("#bloch-sphere-state-x").text(state.x);
        $("#bloch-sphere-state-y").text(state.y);
        $("#bloch-sphere-state-z").text(state.z);
    },

    startToolboxEventListeners: function() {
        $("#theta-angle").on("input change", function () {
            ToolboxEventsNamespace.thetaAngleOnInputChangeEvent();
        });

        $("#phi-angle").on("input change", function () {
            ToolboxEventsNamespace.phiAngleOnInputChangeEvent();
        });

        $("#positive-z").click(function () {
            ToolboxEventsNamespace.GateOnClickEvent(0, 0);
        });

        $("#negative-z").click(function () {
            ToolboxEventsNamespace.GateOnClickEvent(180, 0);
        });

        $("#positive-x").click(function () {
            ToolboxEventsNamespace.GateOnClickEvent(90, 0);
        });

        $("#negative-x").click(function () {
            ToolboxEventsNamespace.GateOnClickEvent(90, 180);
        });

        $("#positive-y").click(function () {
            ToolboxEventsNamespace.GateOnClickEvent(90, 90);
        });

        $("#negative-y").click(function () {
            ToolboxEventsNamespace.GateOnClickEvent(90, 270);
        });

        $("#gate-px").click(function () {
            ToolboxEventsNamespace.RotateOnClickEvent("x", 180);
        });

        $("#gate-py").click(function () {
            ToolboxEventsNamespace.RotateOnClickEvent("y", 180);
        });

        $("#gate-pz").click(function () {
            ToolboxEventsNamespace.RotateOnClickEvent("z", 180);
        });

        $("#x-rot-submit").click(function () {
            ToolboxEventsNamespace.RotateOnClickEvent("x");
        });

        $("#y-rot-submit").click(function () {
            ToolboxEventsNamespace.RotateOnClickEvent("y");
        });

        $("#z-rot-submit").click(function () {
            ToolboxEventsNamespace.RotateOnClickEvent("z");
        });
    },
}

export {
    ToolboxEventsNamespace
};