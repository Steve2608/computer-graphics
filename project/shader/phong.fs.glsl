precision mediump float;

struct Material {
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 emission;
    float shininess;
};

struct Light {
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    float attenuation;
};

struct SpotLight {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec3 direction;
	float angle;
};

//illumination related variables
uniform Material u_material;
uniform Light u_light;
uniform Light u_light2;
uniform SpotLight u_spotLight;

//varying vectors for light computation
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
varying vec3 v_lightVec2;
varying vec3 v_spotLightVec;

//texture related variables
uniform bool u_enableObjectTexture;

varying vec2 v_texCoord;
uniform sampler2D u_tex;

vec4 calculateSimplePointLight(Light light, Material material, vec3 lightVec, vec3 normalVec, vec3 eyeVec, vec4 textureColor) {
    float intensity = 1.0 - (length(lightVec) * light.attenuation);

    lightVec = normalize(lightVec);
    normalVec = normalize(normalVec);
    eyeVec = normalize(eyeVec);

    //compute diffuse term
    float diffuse = 0.0;
    if(dot(normalVec,lightVec) > 0.0) {
        diffuse = intensity;
    }

    //compute specular term
    vec3 reflectVec = reflect(-lightVec,normalVec);
    float spec = pow( max( dot(reflectVec, eyeVec), 0.0) , material.shininess);

    if(u_enableObjectTexture) {
        material.diffuse = textureColor;
        material.ambient = textureColor;
    }

    vec4 c_amb  = clamp(light.ambient * material.ambient, 0.0, 1.0);
    vec4 c_diff = clamp(diffuse * light.diffuse * material.diffuse, 0.0, 1.0);
    vec4 c_spec = clamp(spec * light.specular * material.specular, 0.0, 1.0);
    vec4 c_em   = material.emission;

    return c_amb + c_diff + c_spec + c_em;
}

vec4 calculateSimpleSpotLight(SpotLight light, Material material, vec3 lightVec, vec3 normalVec, vec3 eyeVec, vec4 textureColor) {
    float distance = length(lightVec);
    lightVec = normalize(lightVec);
    normalVec = normalize(normalVec);
    eyeVec = normalize(eyeVec);

    //compute diffuse term
    float diffuse = max(dot(normalVec,lightVec),0.0);

    //compute specular term
    vec3 reflectVec = reflect(-lightVec,normalVec);
    float spec = pow( max( dot(reflectVec, eyeVec), 0.0) , material.shininess);

    if(u_enableObjectTexture) {
        material.diffuse = textureColor;
        material.ambient = textureColor;
    }

    vec4 c_amb  = clamp(light.ambient * material.ambient, 0.0, 1.0);
    vec4 c_diff = clamp(diffuse * light.diffuse * material.diffuse, 0.0, 1.0);
    vec4 c_spec = clamp(spec * light.specular * material.specular, 0.0, 1.0);
    vec4 c_em   = material.emission;

    float angle = acos(dot(normalize(light.direction.xyz), -lightVec));
    if(angle <= light.angle) {
        float factor = clamp((10.0 - distance) / 2.0, 0.0, 1.0);
        return c_amb + factor * (c_diff + c_spec) + c_em;
    } else    {
        return c_amb + c_em;
    }
}

void main() {
    vec4 textureColor = vec4(0.0, 0.0, 0.0, 1.0);
    if(u_enableObjectTexture) {
        textureColor = texture2D(u_tex, v_texCoord);
    }

    gl_FragColor = calculateSimplePointLight(u_light, u_material, v_lightVec, v_normalVec, v_eyeVec, textureColor) +
        calculateSimplePointLight(u_light2, u_material, v_lightVec2, v_normalVec, v_eyeVec, textureColor)+
         calculateSimpleSpotLight(u_spotLight, u_material, v_spotLightVec, v_normalVec, v_eyeVec, textureColor);;
}
