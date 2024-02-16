using System;
using System.Diagnostics;
using System.IO;
using System.Text.Json;

namespace eShopping.Common.Helpers
{
    public static class MeasurementHelper
    {
        /// <summary>
        /// Calculates the lenght in bytes of an object 
        /// and returns the size 
        /// </summary>
        /// <param name="TestObject"></param>
        /// <returns></returns>
        public static int GetObjectSize(object TestObject)
        {
            MemoryStream ms = new MemoryStream();
            var bf = JsonSerializer.SerializeAsync(ms, TestObject);
            byte[] Array;
            Array = ms.ToArray();
            return Array.Length;
        }
    }

    public class MeasureExecutionTime
    {
        public Stopwatch Stopwatch { get; set; }

        public MeasureExecutionTime()
        {
            Stopwatch = new Stopwatch();
        }

        public void Start()
        {
            Stopwatch.Start();
        }

        public string End()
        {
            Stopwatch.Stop();
            var elapsedMilliseconds = Stopwatch.ElapsedMilliseconds.ToString();
            Debug.WriteLine($"\u001b Log time >>> ", elapsedMilliseconds);

            return elapsedMilliseconds;
        }

        public string Log(string title)
        {
            Stopwatch.Stop();
            var elapsedMilliseconds = Stopwatch.ElapsedMilliseconds.ToString();

            Debug.WriteLine($"+> Log time [{title.ToUpper()}] >>> {elapsedMilliseconds}ms");

            Stopwatch.Restart();

            return elapsedMilliseconds;
        }
    }
}
