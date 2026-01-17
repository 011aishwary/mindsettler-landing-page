import path from 'path';
import { PythonShell } from 'python-shell';


export async function POST(req) {
    const msg = await req.json();

    const inp_msg = JSON.stringify(msg);
    console.log("Received message:", msg);
    try {
        // const pythonOptions = {
        //     mode:"text",
        //     pythonPath: "python",
        //     scriptPath: path.join(process.cwd() , 'Mindsettler_agent'),
        //     args: [inp_msg],
        //     timeout:100000
        // };
        console.log("Running Python script with options:", inp_msg);
        const pythonRes = await fetch("/api/mail.py",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );
        const data = await pythonRes.json();
        return NextResponse.json(data);

        // const output = await new Promise((resolve, reject) => {
        //     console.log("Starting PythonShell...");
        //     const pyshell = new PythonShell('mail.py', pythonOptions);

        //     // Send imput to the Python script
        //     pyshell.send(inp_msg);
        //     pyshell.end();

        //     let result = [];

        //     pyshell.on('message', (message) => {
        //         result.push(message);
        //     })
        //     pyshell.on('close', () => {
        //         resolve(result.join(''));
        //     })
        //     pyshell.on('error', (error) => {
        //         reject(error);
        //     })
        // })
        // const out = output

        // console.log("Python script output:", output);

        // return new Response(output, {
        //     status: 200,
        //     headers: { 'Content-Type': 'application/json' }
        // });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            error: "API error",
            details: error.message,
            type: "test ROute"
        }))
    }
}