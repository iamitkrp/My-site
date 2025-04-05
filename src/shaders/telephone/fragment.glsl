uniform vec3 color;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Create a gradient based on position
    vec3 gradientColor = mix(color, color * 1.5, vUv.y);
    
    // Add wave effect
    float wave = sin(vPosition.x * 5.0 + time) * 0.5 + 0.5;
    
    // Add rim lighting
    float rimLight = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    rimLight = pow(rimLight, 3.0);
    
    // Combine effects
    vec3 finalColor = mix(gradientColor, vec3(1.0), rimLight * 0.5);
    finalColor = mix(finalColor, finalColor * (wave * 0.5 + 0.5), 0.3);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
