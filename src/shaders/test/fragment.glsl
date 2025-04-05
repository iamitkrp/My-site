uniform sampler2D uTexture;
varying vec3 vNormal;
varying vec3 eyeVector;

vec2 hash22(vec2 p){
    p = fract(p * vec2(5.3983, 5.4427));
    p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
    return fract(vec2(p.x * p.y * 95.4337, p.x * p.y * 97.597));
}

void main()
{
    
    vec3 X = dFdx(vNormal);
    vec3 Y = dFdy(vNormal);
    vec3 normal=normalize(cross(X,Y));
    float diffuse = dot(normal, vec3(1));

    vec2 rand = hash22(vec2(floor(diffuse * 10.0)));
    vec2 uvv = vec2(
        sign(rand.x - 0.5) * 1.0 + (rand.x - 0.5) * 0.6, 
        sign(rand.y - 0.5) * 1.0 + (rand.y - 0.5) * 0.6
    );

    vec2 uv = uvv * gl_FragCoord.xy/vec2(2000);

    vec3 refraction = refract(eyeVector, normal, 1.0/6.0);
    uv += 0.7 * refraction.xy;
    
    vec4 textureColor = texture2D(uTexture, uv);
    
    gl_FragColor = textureColor;  
}