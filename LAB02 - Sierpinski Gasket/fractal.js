var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 3;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // Inicializar vetor com dois pontos

    var vertices = [
        vec2( -1, 0 ),
        vec2(  1,  0 )
    ];
    points.push(vertices[0], vertices[1]);

    divideLine( vertices[0], vertices[1],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


// função para dividir a linha
function divideLine( a, d, count )
{

    // checando recursão

    if ( count === 0 ) {
        return;
    }
    else {
        var b = mix( a, d, 1/3 );
        var c = mix( a, d, 2/3 );
        var bc = mix( b, c, 0.5 );

        bc[0] -= 1/2*Math.sqrt(3)*(c[1]-b[1]);
        bc[1] += 1/2*Math.sqrt(3)*(c[0]- b[0]);

        points.splice(points.indexOf(d),0, b, bc, c);

        --count;

        // realizar o procedimento para cada segmento

        divideLine( a, b, count );
        divideLine( b, bc, count );
        divideLine( bc, c, count );
        divideLine( c, d, count );
        
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
