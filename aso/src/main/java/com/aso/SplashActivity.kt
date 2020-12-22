package com.aso

import android.content.Intent
import android.content.pm.PackageManager.PERMISSION_DENIED
import android.graphics.Typeface
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.NonNull
import androidx.annotation.Nullable
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.aso.autojs.AutoJs
import com.aso.launch.GlobalProjectLauncher
import com.stardust.app.GlobalAppContext
import com.stardust.autojs.util.AccessibilityServiceTool
import java.util.*

/**
 * Created by Stardust on 2018/2/2.
 */

class SplashActivity : AppCompatActivity() {

    override fun onCreate(@Nullable savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        AccessibilityServiceTool.enableAccessibilityServiceByRootAndWaitFor(2000)

        var pref = getDefaultSharedPreferences(GlobalAppContext.get())
        pref.edit().putBoolean("key_stable_mode", true).apply()

        val slug = findViewById<TextView>(R.id.slug)
        slug.typeface = Typeface.createFromAsset(assets, "roboto_medium.ttf")
        if (!Pref.isFirstUsing) {
            main()
        } else {
            Handler().postDelayed({ this@SplashActivity.main() }, INIT_TIMEOUT)
        }
    }

    private fun main() {
//        checkPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE,
//                Manifest.permission.READ_PHONE_STATE)
        runScript()
    }


    private fun runScript() {
        Thread {
            try {
                GlobalProjectLauncher.launch(this)
            } catch (e: Exception) {
                e.printStackTrace()
                runOnUiThread {
                    Toast.makeText(this@SplashActivity, e.message, Toast.LENGTH_LONG).show()
                    startActivity(Intent(this@SplashActivity, LogActivity::class.java))
                    AutoJs.instance!!.globalConsole.printAllStackTrace(e)
                }
            }
        }.start()
    }

    override fun onRequestPermissionsResult(requestCode: Int, @NonNull permissions: Array<String>, @NonNull grantResults: IntArray) {
        runScript()
    }

    private fun checkPermission(vararg permissions: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val requestPermissions = getRequestPermissions(permissions)
            if (requestPermissions.isNotEmpty()) {
                requestPermissions(requestPermissions, PERMISSION_REQUEST_CODE)
            } else {
                runScript()
            }
        } else {
            runScript()
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.M)
    private fun getRequestPermissions(permissions: Array<out String>): Array<String> {
        val list = ArrayList<String>()
        for (permission in permissions) {
            if (checkSelfPermission(permission) == PERMISSION_DENIED) {
                list.add(permission)
            }
        }
        return list.toTypedArray()
    }

    companion object {

        private const val PERMISSION_REQUEST_CODE = 11186
        private const val INIT_TIMEOUT: Long = 2500
    }

}

